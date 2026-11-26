import "server-only";

import nodemailer, { type Transporter } from "nodemailer";
import { CONTACT_EMAIL } from "@/lib/site";

let transporter: Transporter | undefined;

type NotificationField = {
  label: string;
  value?: string;
};

function requireEnvironment(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function getTransporter() {
  if (transporter) return transporter;

  const port = Number(process.env.SMTP_PORT || "465");
  if (!Number.isInteger(port) || port <= 0) throw new Error("SMTP_PORT is invalid");

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST?.trim() || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: {
      user: requireEnvironment("SMTP_USER"),
      pass: requireEnvironment("SMTP_PASSWORD"),
    },
  });

  return transporter;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cleanHeader(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function environmentLabel() {
  return process.env.VERCEL_ENV === "preview" ? "Preview" : "TreatmentLane";
}

async function sendNotification({
  subject,
  replyTo,
  fields,
}: {
  subject: string;
  replyTo: string;
  fields: NotificationField[];
}) {
  const smtpUser = requireEnvironment("SMTP_USER");
  const recipient = process.env.FORM_NOTIFICATION_TO?.trim() || CONTACT_EMAIL;
  const visibleFields = fields.filter((field) => field.value?.trim());
  const text = visibleFields.map((field) => `${field.label}:\n${field.value?.trim()}`).join("\n\n");
  const html = visibleFields
    .map((field) => `<p><strong>${escapeHtml(field.label)}</strong><br>${escapeHtml(field.value!.trim()).replaceAll("\n", "<br>")}</p>`)
    .join("");

  const result = await getTransporter().sendMail({
    from: process.env.SMTP_FROM?.trim() || `TreatmentLane Forms <${smtpUser}>`,
    to: recipient,
    replyTo: cleanHeader(replyTo),
    subject: `[${environmentLabel()}] ${cleanHeader(subject)}`,
    text,
    html,
  });

  if (!result.accepted?.length) throw new Error("SMTP server did not accept the notification");
}

export async function notifyContactInquiry(input: {
  name: string;
  email: string;
  topic: string;
  message: string;
}) {
  await sendNotification({
    subject: `New contact inquiry from ${input.name}`,
    replyTo: input.email,
    fields: [
      { label: "Name", value: input.name },
      { label: "Email", value: input.email },
      { label: "Topic", value: input.topic },
      { label: "Message", value: input.message },
    ],
  });
}

export async function notifyCorrectionRequest(input: {
  providerSlug: string;
  requesterName: string;
  requesterEmail: string;
  details: string;
  sourceUrl: string;
}) {
  await sendNotification({
    subject: `New listing correction from ${input.requesterName}`,
    replyTo: input.requesterEmail,
    fields: [
      { label: "Requester", value: input.requesterName },
      { label: "Email", value: input.requesterEmail },
      { label: "Provider or listing", value: input.providerSlug },
      { label: "Requested correction", value: input.details },
      { label: "Supporting source", value: input.sourceUrl },
    ],
  });
}

export async function notifyProviderSubmission(input: {
  organizationName: string;
  contactName: string;
  workEmail: string;
  phone: string;
  website: string;
  city: string;
  state: string;
  relationship: string;
  notes: string;
}) {
  await sendNotification({
    subject: `New provider application from ${input.organizationName}`,
    replyTo: input.workEmail,
    fields: [
      { label: "Organization", value: input.organizationName },
      { label: "Contact", value: input.contactName },
      { label: "Email", value: input.workEmail },
      { label: "Phone", value: input.phone },
      { label: "Website", value: input.website },
      { label: "Location", value: `${input.city}, ${input.state}` },
      { label: "Relationship", value: input.relationship },
      { label: "Notes", value: input.notes },
    ],
  });
}

/** Status emails from the automated article pipeline (failures and daily summaries). */
export async function notifyArticlePipeline(subject: string, fields: NotificationField[]) {
  await sendNotification({ subject: `Article pipeline: ${subject}`, replyTo: CONTACT_EMAIL, fields });
}
