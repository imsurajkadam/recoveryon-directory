export const careEditorial: Record<string, { intro: string; sections: { heading: string; body: string }[] }> = {
"treatment-centers": {
    intro: "Residential treatment means you live at the facility for the duration of the program, usually 30, 60, or 90 days. Your days are structured around therapy, group work, and recovery activities, with meals, sleep, and free time on a fixed schedule. It is the most immersive option short of hospital care, designed for people who need distance from their environment and round-the-clock support.",
    sections: [
      { heading: "What does a day in residential treatment look like?", body: "Expect early wake-ups, scheduled meals, and a full day built around group therapy, individual counseling sessions, educational classes, and wellness activities like exercise or meditation. Most programs also assign chores, enforce curfews, and limit phone and visitor access, especially in the first weeks. Medical staff monitor health, and many programs include family sessions or visiting days. Evenings are usually quieter, with peer support meetings or reflection time. The structure is deliberate: it replaces the chaos of active addiction with routine while you build coping skills." },
      { heading: "Who does residential care fit, and who should look elsewhere?", body: "Residential care makes sense when outpatient treatment has not worked, when the home environment is unstable or full of triggers, when use is severe or long-standing, or when co-occurring mental health conditions need daily monitoring. It is usually more than a mild or early-stage problem requires; a professional assessment using the ASAM criteria can confirm the right level. You should be medically stable before entering most residential programs, which means completing detox first if you are physically dependent. If a program admits you while you are still in acute withdrawal without a medical plan, treat that as a serious warning sign." },
      { heading: "What does quality look like, what does it cost, and what should you ask?", body: "Look for state licensing (ask for the license number and verify it), licensed clinical staff such as LCSWs, LPCs, or LCDCs, and evidence-based therapies like cognitive behavioral therapy and motivational interviewing rather than lectures alone. Ask whether the program offers medications for opioid or alcohol use disorder, how it handles co-occurring mental health conditions, and what aftercare planning looks like before discharge. A 2026 national pricing study found 30-day residential programs averaged about $27,500 before insurance, with in-network patients paying roughly one-fifth of that; always get costs in writing. Walk away from guaranteed cures, high-pressure admissions, demands for large upfront cash payments, or programs that advertise amenities far more than clinical care. Ask: what is your license number, what is the staff-to-client ratio, which therapies do you use and why, do you offer medication-assisted treatment, and what exactly happens on the day I leave?" },
    ],
  },
  "medical-detox": {
    intro: "Medical detox is supervised withdrawal management: medical professionals monitor you around the clock while your body clears the substance, using medications and supportive care to keep you safe and as comfortable as possible. It is the doorway to treatment, not the treatment itself. Detox stabilizes you physically so you can begin real recovery work; on its own, it rarely produces lasting change.",
    sections: [
      { heading: "What happens during detox, and how long does it take?", body: "On admission you receive a medical assessment, then staff monitor vital signs and symptoms continuously, adjusting medications as withdrawal progresses. Common approaches include medications such as buprenorphine or clonidine for opioid withdrawal and carefully managed protocols for alcohol withdrawal; the exact plan depends on the substance, your health, and how long you have been using. Most programs stabilize patients within 5 to 10 days, though alcohol withdrawal often peaks within 24 to 72 hours and benzodiazepine withdrawal can take weeks. You will likely feel rough even with good care; the goal is safety first, comfort second." },
      { heading: "When is detox non-negotiable, and what comes next?", body: "Do not attempt to quit alcohol or benzodiazepines on your own. Withdrawal from these substances can cause seizures and delirium tremens, which can be fatal without medical supervision. Opioid withdrawal is rarely life-threatening but intensely unpleasant, and the drop in tolerance afterward makes relapse especially dangerous because overdose risk spikes. For mild dependence with medical clearance, some people detox in less intensive settings, but a doctor should make that call. The most important fact about detox: plan the next step before you arrive. Programs with a direct handoff to residential or outpatient care produce far better outcomes than detox alone, so ask on day one what your transition looks like." },
      { heading: "Costs, insurance, and questions to ask", body: "A 2026 national pricing study estimated medical detox at about $6,500 for an average six-day stay, though many facilities bundle detox into residential pricing. Insurance usually covers detox when it is medically necessary, which it almost always is for alcohol and benzodiazepines. Ask whether a physician is on site or only on call, which substances the unit is equipped to treat, what medications are used, and how they handle complications. Ask what the discharge process looks like and whether they will transfer you directly into their treatment program or help you find one. Be wary of any detox that discharges you with no plan and no follow-up contact; that is where the relapse risk is highest." },
    ],
  },
  "outpatient-programs": {
    intro: "Outpatient programs let you live at home while attending treatment on a fixed schedule. They come in three intensities, and the right one depends on how much structure you need. All three are real treatment, not a lighter afterthought, and many people move through them in sequence as they stabilize.",
    sections: [
      { heading: "The three levels: standard outpatient, IOP, and PHP", body: "Standard outpatient (ASAM Level 1) means fewer than 9 hours a week, usually one or two therapy sessions, and fits mild problems or long-term maintenance. Intensive outpatient, or IOP (Level 2.1), means about 9 to 19 hours a week, typically three-hour sessions three to five days a week, often in the evenings so you can keep working. Partial hospitalization, or PHP (Level 2.5), means 20 or more hours a week, usually five full days, and is sometimes called day treatment. PHP offers nearly the intensity of residential care without overnight stays, with more medical and psychiatric involvement than IOP. A common arc is PHP for two to four weeks, then IOP for eight to twelve weeks, then standard outpatient." },
      { heading: "Who does each level fit?", body: "PHP fits people stepping down from detox or residential care, or those at high relapse risk who are medically stable enough not to need overnight supervision. IOP fits working adults, students, and parents with moderate needs and a stable, supportive home. Standard outpatient fits mild substance use problems or serves as ongoing maintenance after higher levels. Outpatient is the wrong choice when the home environment is unsafe or saturated with triggers, when you cannot stay sober between sessions, or when withdrawal or psychiatric symptoms need daily monitoring; in those cases residential care is safer. An honest program will tell you when you need more than they offer." },
      { heading: "Quality markers, costs, and red flags", body: "Good programs start with an assessment, assign individual therapy alongside groups (not groups only), use evidence-based approaches like CBT and motivational interviewing, and have clear policies on drug testing and family involvement. They measure progress and adjust the plan, and they plan discharge from the start. A 2026 pricing study estimated IOP at about $10,400 for 30 sessions and PHP at about $15,000 for 30 days before insurance, with in-network costs far lower; confirm coverage and get it in writing. Red flags include programs that are group-therapy-only with no individual sessions, no licensed clinicians on staff, vague answers about what a week actually includes, and billing practices you cannot get explained in plain language. Ask: how many hours per week, and how many are individual versus group, what credentials do the counselors hold, how do you measure whether I am improving, and what happens if I relapse during the program?" },
    ],
  },
  "counseling-therapy": {
    intro: "Counseling and therapy are the backbone of addiction treatment at every level of care. This is where you work one-on-one with a clinician, with your family, or in a group to understand your substance use, build coping skills, and address the underlying issues that feed it. It can be a starting point, the core of an outpatient program, or long-term aftercare.",
    sections: [
      { heading: "What does addiction counseling actually involve?", body: "It starts with an assessment and a written treatment plan with goals you review together. Sessions are typically weekly, 45 to 60 minutes, using approaches with research behind them: cognitive behavioral therapy for changing thought and behavior patterns, dialectical behavior therapy for emotional regulation, and motivational interviewing for working through ambivalence about change. Family sessions address how substance use has affected relationships and how loved ones can support recovery without enabling it. Group counseling adds peer perspective and accountability. A licensed therapist is different from a peer counselor or sponsor: therapists have graduate training, state licenses, and a scope of practice that includes diagnosis and clinical treatment." },
      { heading: "Who does it help most, and when is it not enough?", body: "Therapy alone is often enough for mild to moderate substance use problems, especially with a stable life and strong motivation. It is also the standard backbone of aftercare following residential or intensive programs, and the right setting for co-occurring conditions like depression, anxiety, or trauma when the clinician is trained in both. It is not enough on its own for severe physical dependence, which needs medical detox first, or when someone cannot stay safe between weekly sessions; those situations call for IOP, PHP, or residential care. If a therapist keeps seeing you weekly while you are clearly deteriorating, ask directly whether a higher level of care is warranted." },
      { heading: "Finding a good therapist: credentials, cost, and red flags", body: "Look for a state license you can verify: LPC (licensed professional counselor), LCSW (licensed clinical social worker), LMFT (licensed marriage and family therapist), or an addiction-specific credential such as CADC or LCDC, depending on your state. Ask how much of their practice is addiction-specific, because a generalist who rarely treats substance use is a weaker choice. Costs vary widely; many therapists take insurance with a standard copay, and community clinics offer sliding-scale fees. Red flags include no verifiable license, guarantees of success, discouraging you from seeing a doctor or psychiatrist, pushing a single approach for every client, or no written treatment plan after several sessions. Ask: what is your license and how can I verify it, what percentage of your clients have substance use disorders, which therapeutic approaches do you use and why, how will we know if it is working, and how do you coordinate with my other care?" },
    ],
  },
"sober-living": {
    intro: "A sober living home is a substance-free residence where people in recovery live together under shared rules while rebuilding daily life. It sits between formal treatment and fully independent living: more structure than an apartment, less supervision than a treatment center. For many people, it is the bridge that makes early recovery sustainable.",
    sections: [
      {
        heading: "What does daily life look like?",
        body: "Residents typically follow a curfew, take on household chores, submit to regular drug and alcohol testing, and attend house meetings. Most homes expect residents to work, attend school, or participate in an outpatient program during the day. Overnight guests, romantic partners, and any substance use are usually prohibited. The structure is the point: accountability and routine protect recovery while residents practice living independently.",
      },
      {
        heading: "What does quality look like, and where is the regulation gap?",
        body: "Be honest about this: sober living is largely unregulated in most states. The main quality signal is certification through a state affiliate of the National Alliance for Recovery Residences (NARR), which sets standards across four levels from peer-run homes (Level I) to residences with clinical services (Level IV). Ask which level a home is certified at, and verify it with the state affiliate. A quality home has a written resident agreement, a clear fee schedule and refund policy, posted house rules, a drug-testing policy, and a written relapse and discharge policy.",
      },
      {
        heading: "Costs and how people pay",
        body: "Most sober living homes charge roughly $500 to $1,500 per month, about the cost of a modest apartment, with higher prices in expensive metro areas and for private rooms. Health insurance rarely covers sober living because it is housing, not treatment, so most residents pay out of pocket. Some states offer vouchers or grant-funded beds for people who qualify, so ask the home and your county behavioral health office about assistance before assuming you cannot afford it.",
      },
      {
        heading: "Red flags and questions to ask",
        body: "Walk away from homes with no written agreement, vague or changing fees, no drug testing, or tolerance of active substance use on the premises. Also be cautious if the home refuses to say what happens after a relapse, since a responsible home has a clear, written policy. Ask: are you certified, and at which NARR level? What is the drug-testing policy? What is your policy on prescribed medications, including medications for opioid use disorder? What exactly happens, step by step, if someone relapses?",
      },
    ],
  },
  "support-groups": {
    intro: "Support groups are free, peer-led meetings where people in recovery share experience and encouragement. They exist in nearly every community and online, cost nothing, and welcome anyone. They are one of the most widely used recovery resources in the country, and they work best alongside professional care, not instead of it.",
    sections: [
      {
        heading: "The main options",
        body: "Alcoholics Anonymous (AA) and Narcotics Anonymous (NA) are the best known, built around a 12-step program and sponsorship, with meetings worldwide. SMART Recovery takes a different approach based on cognitive-behavioral tools, is secular, and is usually led by a trained facilitator. LifeRing offers secular peer support focused on abstinence, Women for Sobriety serves women specifically, and Celebrate Recovery is a faith-based option. Research has found these alternatives can be as effective as AA for alcohol problems, so the best group is the one you will actually keep attending.",
      },
      {
        heading: "What are meetings actually like?",
        body: "Most meetings open with readings, then members share one at a time without interruption or cross-talk. Nobody is required to speak, and what is said stays in the room. There are no fees, though most groups pass a basket for voluntary contributions to cover rent and literature. Sponsorship, where a more experienced member guides a newer one through the steps, is central to 12-step groups but optional. Many groups now meet online too, which helps people in rural areas or with difficult schedules.",
      },
      {
        heading: "Limits and red flags",
        body: "Support groups are peer support, not medical treatment. They do not provide diagnosis, detox, therapy, or medication management, and a group is no substitute for professional care when you need it. Be wary of any group that pressures you financially, discourages prescribed medication (including medications for opioid use disorder), or claims its approach is the only valid path to recovery. A healthy group welcomes questions, respects outside professional help, and never guarantees outcomes.",
      },
      {
        heading: "How do you start?",
        body: "Try several different meetings before judging the idea, since the feel varies enormously from one group to another. Look for open meetings if you want to bring a family member along, and closed meetings if you prefer a room of people in recovery only. Ask: is this meeting open or closed? Are newcomers welcome to just listen? Do you have online options? If one philosophy does not fit, try another rather than giving up on peer support entirely.",
      },
    ],
  },
  "mental-health-services": {
    intro: "Many people dealing with addiction are also dealing with depression, anxiety, trauma, or another mental health condition. Federal survey data shows about a third of adults with a mental illness also have a substance use disorder, and nearly half of adults with a substance use disorder also have a mental illness. When both are present, treating them together works better than treating either one alone.",
    sections: [
      {
        heading: "What does integrated care look like?",
        body: "Quality care for co-occurring disorders means one coordinated team addressing both conditions at the same time, not an addiction program that hands you a separate therapist referral. Expect a thorough assessment of both conditions, a single treatment plan, evidence-based therapies such as cognitive-behavioral therapy or dialectical behavior therapy, and medication management where appropriate. Many safe, non-addictive psychiatric medications do not interfere with recovery. The team should also monitor both conditions over time, since symptoms of each can trigger the other.",
      },
      {
        heading: "Levels of care",
        body: "Mental health support for people in recovery ranges from weekly outpatient therapy and psychiatry visits up to partial hospitalization and intensive outpatient programs. Residential care may be appropriate when symptoms are severe, when safety is a concern, or when previous outpatient attempts have not held. If you ever feel you might act on thoughts of harming yourself, call or text 988 to reach the Suicide and Crisis Lifeline, which operates around the clock.",
      },
      {
        heading: "What does quality look like?",
        body: "Look for licensed clinicians, ideally with specific experience in both addiction and mental health, and a program that can describe exactly how the two sides of care coordinate. Ask whether a psychiatrist is on staff or only available by referral, how the team handles medication decisions, and what the crisis protocol is after hours. A written safety and crisis plan, family involvement where appropriate, and scheduled follow-up after discharge are all marks of a serious program.",
      },
      {
        heading: "Costs, insurance, and questions to ask",
        body: "Mental health care is usually covered by insurance on the same terms as other medical care under federal parity law, including therapy, psychiatry, and intensive programs. Confirm the provider is in-network for your specific plan and ask about prior authorization requirements. Ask: how do your addiction and mental health staff coordinate day to day? Is psychiatric medication management available in-house? What happens if my symptoms worsen, do you have a crisis protocol? How do you involve my family, and what does aftercare look like?",
      },
    ],
  },
  "recovery-support": {
    intro: "Recovery support covers the people and organizations that help you stay in recovery after, or alongside, formal treatment: peer specialists, recovery coaches, and community recovery organizations. This support is practical and personal rather than clinical. It helps with the everyday work of building a stable life in recovery.",
    sections: [
      {
        heading: "What does recovery support include?",
        body: "A certified peer recovery specialist is someone in recovery who has completed training and uses their own experience to help others navigate treatment, find meetings, apply for benefits, or handle setbacks. Recovery coaches work one-on-one on goals like employment, housing, and daily structure. Recovery community organizations run drop-in centers, social events, volunteer opportunities, and advocacy. None of these are therapy: peer supporters do not diagnose or provide clinical treatment, and that boundary is part of what makes the relationship work.",
      },
      {
        heading: "Who does it help, and what are its limits?",
        body: "Peer support is associated with better treatment engagement, fewer relapses, and fewer emergency department visits, largely because it reduces isolation and connects people to resources quickly. It is especially valuable during transitions: leaving residential treatment, moving to a new city, or rebuilding after a relapse. But it complements professional care rather than replacing it. If you need detox, medication management, or therapy for a mental health condition, a peer supporter should be helping you get those services, not substituting for them.",
      },
      {
        heading: "Costs",
        body: "Much of this support is free to the person receiving it. Peer specialist services are often funded through state grants, Medicaid programs, or nonprofit organizations, and recovery community centers typically charge nothing for drop-in participation. Private recovery coaching is the exception: independent coaches usually charge out of pocket, with rates varying widely, so ask for clear pricing up front. If cost is a barrier, start with your local recovery community organization or the SAMHSA helpline at 1-800-662-4357 for referrals to no-cost options.",
      },
      {
        heading: "Quality markers and questions to ask",
        body: "Look for peer specialists with recognized state certification, supervision by a qualified professional, and clear boundaries around their role. A good coach or organization will explain what they do and do not provide, and will connect you to clinical care when needed rather than discouraging it. Ask: what certification or training do your peer specialists hold? Who supervises them? How do you handle it if someone needs a higher level of care? Are your services free, and if not, what exactly do they cost?",
      },
    ],
  }
};

// SOURCES
// (URLs consulted during research):
// - https://www.rehab.com/levels-of-care (ASAM levels 0.5-4, Level 1 <9 hrs/week, IOP 9-19, PHP 20+)
// - https://clearstepsrecovery.com/recovery-programs/iop-vs-php (IOP 9-19 hrs, PHP 20+ hrs per ASAM/SAMHSA)
// - https://americanaddictioncenters.org/withdrawal-timelines-treatments (alcohol peaks 24-72h, DTs 48-72h; opioids 4-10 days; benzo protracted)
// - https://www.counselingpsychology.org/addiction-counseling-vs-addiction-psychology/ (CADC/LPC, MI/CBT/relapse prevention training)
// - https://neurolaunch.com/how-to-become-an-addiction-therapist/ (LPC/LCSW/LMHC/MFT licenses, LCDC, MAC/NCAC-II)
// - Cost figures: 2026 Recovery.com national pricing study (detox ~$6,500/6 days, residential ~$27,500/30 days, PHP ~$15,000, IOP ~$10,400; in-network ~1/5 of list)

