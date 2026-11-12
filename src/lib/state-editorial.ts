export const stateEditorial: Record<string, { intro: string; sections: { heading: string; body: string }[] }> = {
  california: {
    intro: "California has more addiction treatment options than any other state, which is good news and a challenge. More choice means more chances to find the right fit, but it also means more programs competing for your attention, not all of them legitimate. California runs one of the strictest licensing systems in the country, so understanding it is the fastest way to separate solid providers from risky ones.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "Residential addiction treatment in California is licensed by the Department of Health Care Services (DHCS), through its Substance Use Disorder Licensing and Certification Division. Any facility offering 24-hour residential recovery services to adults must hold a DHCS license, which covers detoxification, residential treatment, or both. DHCS also certifies outpatient programs on a voluntary basis, and many counties require that certification before a program can receive public funds. Youth residential programs follow a different path: they are licensed by the Department of Social Services and certified by DHCS. To check a facility, use the DHCS public directory of licensed and certified programs, organized alphabetically by county. If a residential program does not appear there, consider that a serious red flag.",
      },
      {
        heading: "Paying for treatment",
        body: "California's Medicaid program is called Medi-Cal, and addiction treatment is covered through the Drug Medi-Cal Organized Delivery System. It pays for the full continuum of care, including assessment, detox, residential treatment, intensive outpatient and standard outpatient care, medications for opioid use disorder, and recovery services, with no copays for members. One thing that confuses people: substance use treatment usually runs through your county behavioral health department, not your Medi-Cal managed care plan, so the county access line is the fastest first call. Private insurance plans must cover addiction treatment on par with other medical care under state and federal parity laws. If you have no insurance, county programs cannot turn you away for inability to pay, and federal rules give priority admission to pregnant women and people who inject drugs.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the program's DHCS license or certification number, and check it against the public directory before you visit. Ask which levels of care are provided on site versus referred elsewhere, since some programs advertise services they do not actually deliver. Confirm whether the program bills Medi-Cal or your private insurer directly, or expects payment upfront. Ask which medications for opioid or alcohol use disorder the clinicians prescribe, because access to these medications varies widely. Ask what a typical day looks like and what the staff-to-client ratio is. Finally, ask what happens after discharge, including whether the program offers recovery coaching, alumni groups, or structured aftercare.",
      },
    ],
  },
  texas: {
    intro: "Texas handles addiction treatment licensing through a single state agency, which makes checking a provider simpler than in many states. But Texas is enormous, and the quality and availability of care differ a lot between major cities and rural counties. Here is how oversight works, how to pay for treatment, and what to ask before choosing a program.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "In Texas, chemical dependency treatment facilities are licensed by the Health and Human Services Commission (HHSC), through its Regulatory Services Division, under Health and Safety Code Chapter 464. Any facility offering a structured chemical dependency treatment program must hold this license, with only narrow exemptions such as federal facilities or a private practitioner's own office. HHSC also licenses individual chemical dependency counselors, known as LCDCs. To verify a program, use the HHSC online licensing search or its published lists of licensed chemical dependency treatment facilities. A reputable program will share its license number willingly; reluctance to do so is a warning sign.",
      },
      {
        heading: "Paying for treatment",
        body: "Texas Medicaid is delivered through managed care programs, mainly STAR, STAR+PLUS, and STAR Health. These plans must cover substance use disorder services including assessment, counseling, residential treatment, withdrawal management, and medication-assisted treatment, and care coordinators are required to connect members with the full continuum of care. Private insurance must cover addiction treatment comparably to other medical care under federal parity rules. For the uninsured, many Texas providers receive state and federal grant funding and offer sliding-scale fees, so ask about this early. One important caveat: Texas has not expanded Medicaid under the Affordable Care Act, so eligibility is narrower than in many states and mainly covers children, pregnant women, parents with very low incomes, and people with disabilities. Many working-age adults fall into a coverage gap, and for them the federal marketplace or state-funded providers may be the realistic options.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the facility's HHSC license number and confirm it through the state's online search. Ask whether the counselors are licensed LCDCs and what the counselor-to-client ratio is, since Texas regulates both the facility and the individual counselor. Confirm which Medicaid managed care plans the program accepts, or how it bills private insurance. Ask whether medication-assisted treatment is offered on site and which medications are available. Ask how the program treats co-occurring mental health conditions, because integrated care leads to better outcomes. Finally, ask about discharge planning: what aftercare is arranged, and does anyone follow up after you leave?",
      },
    ],
  },
  florida: {
    intro: "Florida has a large addiction treatment industry, and one of the most detailed licensing frameworks in the country, built partly in response to past abuses. That history is exactly why understanding the rules matters here more than almost anywhere. Here is how Florida licenses providers, how to pay for care, and what to ask.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "Florida licenses substance abuse treatment providers through the Department of Children and Families (DCF), under Chapter 397 of Florida Statutes and Rule 65D-30. DCF licenses individual service components, so a provider must hold a license for each type of care it offers: detox, residential, outpatient, and others. Some facilities are also licensed by the Agency for Health Care Administration (AHCA), which regulates health care facilities more broadly, and recovery residences can earn certification through approved credentialing bodies. To verify a provider, check DCF's published lists of licensed providers and cross-reference facilities through AHCA's Florida Health Finder. Ask the program exactly which components it is licensed for, and make sure that matches the services it advertises. Mismatches between advertised and licensed services are a major red flag.",
      },
      {
        heading: "Paying for treatment",
        body: "Florida Medicaid operates through the Statewide Medicaid Managed Care (SMMC) program, where members enroll in a managed medical assistance plan. Substance abuse treatment is among the minimum services these plans must cover, and many plans add expanded benefits such as intensive outpatient programs and medication-assisted treatment. Private insurance must cover addiction treatment under federal parity law. For the uninsured, Florida distributes state and federal funding to community providers, so ask about state-funded openings or sliding-scale fees. Be aware that, like Texas, Florida has not expanded Medicaid under the Affordable Care Act, which leaves many low-income adults without coverage; the federal marketplace may be an option at higher income levels. One Florida-specific point: the state's Marchman Act allows families to seek court-ordered assessment and treatment for a loved one who refuses care. An admissions counselor can explain how that process works.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask which DCF-licensed service components the program holds and verify them against the state's published lists. Confirm the program is in-network with your SMMC Medicaid plan or your private insurer, and get the answer in writing before admission. Ask whether medication-assisted treatment is available from day one and which medications are offered. Ask how the program handles a situation where your loved one refuses care, including its experience with the Marchman Act process. Ask how families are involved in treatment planning. Finally, ask what recovery support continues after discharge, such as step-down care, alumni programs, or connections to community recovery resources.",
      },
    ],
  },
  "new-york": {
    intro: "New York has a large treatment system that includes hospital-based care, community programs, residential services, outpatient clinics, and opioid treatment programs. The state also publishes unusually detailed information about certified programs. That makes it possible to check a provider before sharing personal information or paying a deposit, but only if you know which state tools to use.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The New York State Office of Addiction Services and Supports (OASAS) certifies substance use disorder treatment programs. A provider generally needs OASAS approval and certification before opening an addiction service, and later changes to services also require notice and approval. OASAS rules cover different settings, including withdrawal and stabilization, inpatient rehabilitation, residential services, and outpatient programs. Use the official OASAS Provider and Program Search to confirm the program name, address, and approved service type. New York also credentials addiction professionals, including Credentialed Alcoholism and Substance Abuse Counselors, but a counselor credential does not replace program certification. Confirm both when each is relevant.",
      },
      {
        heading: "Paying for treatment",
        body: "New York Medicaid covers a broad range of substance use disorder care. Depending on eligibility and plan type, benefits can include outpatient treatment, intensive outpatient care, residential services, withdrawal management, opioid treatment, and medications for addiction treatment. Most members receive behavioral health benefits through Medicaid managed care. Adults with significant behavioral health needs may qualify for a Health and Recovery Plan, which adds care management and community-based supports. Private coverage varies by network and authorization rules, so ask the insurer to identify the exact benefit, deductible, and approved level of care. If a program says it accepts insurance, verify that it is in network for your specific plan rather than relying on a general statement.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the program's OASAS operating certificate number and look it up in the state directory. Confirm that the listed service type matches what is being recommended, especially for residential care or withdrawal management. Ask whether the program will continue an existing medication for opioid or alcohol use disorder when clinically appropriate. Get a written explanation of insurance authorization, expected out-of-pocket costs, and any services billed by a separate medical group. Ask who completes the level-of-care assessment, which credentials the clinical staff hold, and how co-occurring mental health conditions are treated. Before admission, also ask what step-down care will be arranged and who coordinates the transition.",
      },
    ],
  },
  pennsylvania: {
    intro: "Pennsylvania organizes addiction treatment through state licensing and a county-based access system. The Department of Drug and Alcohol Programs oversees treatment facilities, while local Single County Authorities help residents find care and may help with funding. Using both systems can make a search faster and reduce the risk of choosing a program that is not licensed for the service it advertises.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Pennsylvania Department of Drug and Alcohol Programs (DDAP) licenses drug and alcohol treatment facilities and recovery houses. Its public Drug and Alcohol Facility Locator shows licensed programs, service types, license status, and inspection information. Search the exact facility address, not only the parent company's name, because a provider may operate several locations with different approvals. The state license identifies whether a site is approved for outpatient, inpatient, detoxification, or another level of care. Pennsylvania also publishes facility surveys and certificates through the locator. Review those records and ask about any recent corrective actions before committing to a program.",
      },
      {
        heading: "Paying for treatment",
        body: "Pennsylvania's county drug and alcohol offices, called Single County Authorities or SCAs, can assess treatment needs, make referrals, and help people understand possible treatment funding. This is especially useful for someone who is uninsured, underinsured, or unsure where to start. Medicaid members should ask their plan or county behavioral health system which providers and levels of care are covered. Private insurance benefits may depend on medical necessity review, network status, and prior authorization. Get the program's legal name, billing entity, and tax identification information before calling the insurer, since a familiar brand name may not match the name used for claims. Ask for a written estimate that separates clinical treatment, medications, laboratory work, and housing charges.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the DDAP facility license number and verify the exact location in the state locator. Confirm that the license covers the level of care being recommended and review the latest inspection information. Ask whether the provider is contracted with your Medicaid or private plan, who handles prior authorization, and what happens if the insurer approves fewer days than expected. If you need public funding, ask the local SCA whether an assessment or referral is required before admission. Also ask which addiction medications are available, how medical emergencies are handled, what credentials direct-care staff hold, and how the program plans for continuing care after discharge.",
      },
    ],
  },
  ohio: {
    intro: "Ohio regulates addiction services through its behavioral health licensing and certification system, while Ohio Medicaid covers services across outpatient, residential, and withdrawal settings. The terminology can be confusing because a provider may hold a community behavioral health certification plus a separate license for a specialized service. Checking both the agency and the service offered is important.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "Ohio's Department of Behavioral Health licenses and certifies more than 2,000 behavioral health providers under the Ohio Administrative Code. Substance use disorder services commonly operate under certification as a Community Behavioral Health Services provider. That certification can include outpatient treatment, substance use disorder residential care, and withdrawal management. Opioid treatment programs require the community behavioral health certification and an additional opioid treatment program license. Use the department's licensure and certification resources to confirm the provider and ask the program to identify every certified service it delivers at the location. A general agency certification does not prove that every advertised level of care is approved.",
      },
      {
        heading: "Paying for treatment",
        body: "Ohio Medicaid behavioral health benefits include counseling, psychotherapy, medications for substance use disorder, intensive outpatient treatment, residential treatment, and withdrawal management when coverage requirements are met. Most Ohio Medicaid members receive coverage through managed care organizations, so network participation and authorization can differ by plan. A provider that is certified by the state must also be properly enrolled with Ohio Medicaid to bill the program. Private insurance can have separate networks for facility care, professional services, pharmacy benefits, and laboratory work. Ask both the program and the plan to confirm coverage for the specific level of care, location, and expected length of stay before admission.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask whether the location is certified as a Community Behavioral Health Services provider and which substance use disorder services appear on its certificate. For an opioid treatment program, ask for the separate state license and federal certification information. Confirm whether the program and each major billing entity are enrolled with your Medicaid managed care plan or private insurer. Ask how the clinical team decides between outpatient, intensive outpatient, residential, and withdrawal management care. Find out which medications for opioid or alcohol use disorder are offered, whether they are started on site, and whether the program will continue medication prescribed elsewhere. Finally, request the discharge plan and follow-up schedule in writing.",
      },
    ],
  },
  illinois: {
    intro: "Illinois addiction treatment is regulated at the program level, with licensed services ranging from outpatient and intensive outpatient care to residential treatment and recovery homes. Medicaid behavioral health care is administered separately, so a state license and Medicaid participation answer different questions. Verify both before assuming that a program is approved and affordable.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Illinois Department of Human Services licenses substance use disorder treatment organizations through its Division of Substance Use Prevention and Recovery. State rules under Part 2060 set standards for treatment and intervention services. A license identifies the services approved at a particular site, such as outpatient care, intensive outpatient care, residential treatment, withdrawal management, or recovery home services. Illinois provides a statewide service database and licensed-provider directories that can be used to check an organization and location. Ask the provider for its Illinois license number and compare the service description with the level of care being offered. Do not treat an individual clinician's professional license as a substitute for the program's required approval.",
      },
      {
        heading: "Paying for treatment",
        body: "Illinois Medicaid covers behavioral health services through enrolled providers, including substance use recovery services. Members may receive care through a Medicaid managed care plan or another Medicaid arrangement, depending on eligibility. The Illinois Department of Healthcare and Family Services directs members to its behavioral health resources and the state's SPIDER service database to find programs. Coverage still depends on the member's plan, the provider's enrollment and network status, medical necessity, and any required authorization. Ask the plan to confirm the program's exact address and billing name. If you are uninsured, ask the provider whether it receives state or federal funding and whether a sliding fee or publicly funded placement is available.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask which Part 2060 services the site is licensed to provide and verify the license in the state directory. Confirm whether detoxification or residential care occurs at that location or through a referral partner. Ask whether the organization is enrolled with Illinois Medicaid and contracted with your specific managed care plan. Request a written estimate for services that Medicaid or private insurance may not cover, including housing, transportation, and laboratory testing. Ask which evidence-based therapies and medications are available, how co-occurring mental health conditions are handled, and which clinicians are present after normal business hours. Also ask who will arrange follow-up medication, counseling, and recovery support when the program ends.",
      },
    ],
  },
  washington: {
    intro: "Washington combines state licensing of behavioral health agencies with an integrated Medicaid system called Apple Health. The state's public tools make it possible to verify a treatment location and then check whether it participates in the member's health plan. That two-step review matters because a licensed agency is not automatically in network for every plan.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Washington State Department of Health licenses and regulates inpatient and outpatient Behavioral Health Agencies. A licensed agency may be certified to provide mental health, substance use disorder, problem gambling, or a combination of services. The department publishes a downloadable directory and a real-time facility search. Use the exact address to confirm the agency's license status and certified services. This is particularly important when a company uses one brand across several locations. Washington also licenses individual substance use disorder professionals, but the professional credential and the agency license serve different purposes. Ask which credentialed staff provide assessment, counseling, medication management, and overnight care.",
      },
      {
        heading: "Paying for treatment",
        body: "Washington Medicaid is called Apple Health. Most members receive physical health, mental health, and substance use disorder treatment through one managed care plan. Apple Health funds services such as alcohol treatment, opioid use treatment, and medications for opioid use disorder, subject to coverage and clinical requirements. Members generally need an in-network provider unless the plan authorizes another arrangement. Some crisis and safety-net services are coordinated through regional Behavioral Health Administrative Services Organizations, including help for people who are not enrolled in Apple Health. Before admission, call the plan with the provider's legal name and address, then ask about authorization, copayments, transportation, pharmacy coverage, and any services billed outside the facility fee.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the Behavioral Health Agency license number and verify which substance use disorder services are certified at the location. Confirm whether the program is contracted with your Apple Health managed care plan or private insurer, not simply whether it accepts that type of insurance. Ask who performs the assessment and how the recommended level of care is selected. Find out whether medication for opioid or alcohol use disorder is available on site and whether existing prescriptions will be continued. For residential care, ask about medical coverage overnight, emergency transfer procedures, family contact, and discharge planning. Request a written list of costs that are not included in the quoted program rate.",
      },
    ],
  },
  arizona: {
    intro: "Arizona has a large mix of behavioral health clinics, residential facilities, community providers, and tribal health programs. Facility licensing is handled by the state health department, while public coverage is administered through AHCCCS, Arizona's Medicaid program. Checking the facility license and the health plan network separately is the safest way to evaluate a program.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Arizona Department of Health Services licenses health care institutions, including behavioral health facilities. Its Bureau of Behavioral Health Facilities Licensing oversees relevant facility types, and AZ Care Check provides a public search of license status, history, deficiencies, and enforcement actions. Search the exact facility name and address, then review the license subtype and current status. A behavioral health residential facility license does not automatically mean that every clinical service advertised by a company is provided at that site. Ask which services are delivered under the facility license, which are provided by separately licensed professionals, and which are referred to outside organizations. Opioid treatment programs also have federal certification requirements.",
      },
      {
        heading: "Paying for treatment",
        body: "Arizona's Medicaid program is the Arizona Health Care Cost Containment System, usually called AHCCCS. Behavioral health benefits are commonly delivered through managed care plans, and the AHCCCS online directory lists enrolled providers and whether they are accepting new members. Enrollment with AHCCCS does not guarantee participation in every managed care network, so members should confirm the provider with their specific health plan. Ask whether residential, outpatient, medication, laboratory, and transportation services require separate authorization. People who are not eligible for Medicaid may be able to use block-grant or other publicly funded behavioral health services, but availability and eligibility vary. Ask the regional or tribal behavioral health system what funding is open before paying privately.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the Arizona facility license number and review the location in AZ Care Check. Confirm the license type, current status, and any enforcement history. Ask whether the provider appears in the AHCCCS directory and is contracted with your exact health plan. Get written confirmation of authorization and out-of-pocket costs before admission. Ask which level-of-care criteria are used, who provides medical supervision, and how withdrawal risks are assessed. Find out whether medications for opioid or alcohol use disorder are available without delay and whether the program will continue an existing prescription. For residential programs, ask what clinical staff are physically present overnight and how emergencies are transferred.",
      },
    ],
  },
  "north-carolina": {
    intro: "North Carolina's treatment system combines state facility licensing with regional behavioral health organizations and several Medicaid plan types. The path into care can depend on both the service needed and the member's plan. A facility license, Medicaid enrollment, and a plan contract are separate checks, and all three may matter before treatment begins.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The North Carolina Division of Health Service Regulation licenses mental health and substance use disorder services under state law. Licensure requirements vary by setting and service, including residential and structured outpatient programs. Prospective residential providers generally work with the regional Local Management Entity or Managed Care Organization, often called an LME/MCO, as part of the licensure and public-funding process. Ask the program for the license number tied to the exact address and the rule under which the service operates. Confirm that the licensed service matches the advertised level of care. National accreditation may also be required for some Medicaid behavioral health services, but accreditation does not replace the state license.",
      },
      {
        heading: "Paying for treatment",
        body: "NC Medicaid covers substance use disorder services through managed care arrangements that depend on the member's needs and plan. Behavioral Health and Intellectual or Developmental Disabilities Tailored Plans serve many people with severe substance use disorders and integrate medical, pharmacy, and specialized behavioral health benefits. Regional LME/MCOs and Tailored Plans can provide information and referrals for covered services. North Carolina expanded several substance use disorder benefits effective in 2026, including stand-alone coverage policies for intensive outpatient and residential levels of care. Coverage still depends on clinical criteria, provider enrollment, network status, and authorization. Call the number on the Medicaid card and confirm the exact provider, site, and level of care.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the North Carolina facility or service license number and verify which level of care it covers. Confirm whether the program is enrolled with NC Medicaid and contracted with your Standard Plan, Tailored Plan, LME/MCO, or private insurer. Ask who completes the assessment and whether the recommendation follows the state's current clinical coverage policy. Get written details about authorization, expected length of stay, and non-covered charges. Ask which medications for opioid or alcohol use disorder are offered and whether they are available during residential care. Also ask who manages co-occurring mental health needs, what happens if the plan denies additional days, and how follow-up care is arranged near home.",
      },
    ],
  },
  georgia: {
    intro: "Georgia changed its addiction-treatment licensing structure in 2026, so current verification matters. The state behavioral health department now licenses the main categories of drug treatment programs, while Medicaid reimbursement is administered through a separate state agency and managed care plans. Older provider materials may name the previous licensing office, which is another reason to use current state sources.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "Effective January 1, 2026, the Georgia Department of Behavioral Health and Developmental Disabilities (DBHDD) became the licensing authority for Drug Abuse Treatment and Education Programs and Narcotic Treatment Programs. DATEP rules cover residential and nonresidential treatment programs, and a program must hold a license before operating. New branch locations generally require separate licenses under rules effective in 2026. Ask for the license attached to the exact treatment address, not only the parent organization. A recovery residence that provides housing alone may fall under different rules than a residence that delivers treatment. Opioid treatment programs also need federal certification, so ask to verify both the state and federal approvals.",
      },
      {
        heading: "Paying for treatment",
        body: "Georgia Medicaid reimbursement and behavioral health policy are administered by the Department of Community Health in partnership with DBHDD. Many eligible members receive services through one of the state's Care Management Organizations, which authorizes care and maintains its own provider network. DBHDD also contracts with community providers across six regions and supports outpatient, intensive outpatient, residential, withdrawal management, opioid treatment, and peer services. Availability and payment source vary by program. Call the Medicaid plan with the provider's legal billing name and address, and ask whether the proposed level of care requires authorization. If you are uninsured, contact the regional DBHDD system to ask about publicly funded providers before assuming private payment is the only option.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the current DBHDD DATEP or Narcotic Treatment Program license and confirm that it belongs to the location you will attend. Ask whether each service is delivered on site, especially detoxification, residential care, and medication treatment. Confirm that the program is enrolled with Georgia Medicaid and contracted with your exact Care Management Organization or private insurer. Request a written estimate that identifies housing, clinical, medical, pharmacy, and laboratory charges. Ask what clinical criteria determine the level of care, which medications for opioid or alcohol use disorder are offered, and how co-occurring mental health needs are managed. Finally, ask which provider will handle medications and counseling after discharge.",
      },
    ],
  },
  michigan: {
    intro: "Michigan requires state licenses for substance use disorder service programs and routes much of its public specialty behavioral health care through regional plans. A licensed program may offer only the service categories listed on its record, while Medicaid payment depends on a separate contract and authorization process. Check the site, service, and payer before making a decision.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Michigan Department of Licensing and Regulatory Affairs (LARA), through the Bureau of Community and Health Systems, licenses substance use disorder service programs. State law requires a license before a program can operate, and licenses are renewed annually. Michigan's public license search can be filtered for substance use disorder programs and shows categories such as outpatient, residential, withdrawal management, and methadone services. Search the exact address and compare the listed categories with the provider's offer. A company may have several sites with different licensed services. Individual clinicians may also hold professional licenses, but those credentials do not replace the program license required for the facility or service.",
      },
      {
        heading: "Paying for treatment",
        body: "Michigan Medicaid and the Healthy Michigan Plan cover specialty behavioral health and substance use disorder services through regional Prepaid Inpatient Health Plans, known as PIHPs. The PIHP can explain eligibility, complete or arrange an assessment, and identify contracted providers. Michigan also operates a Substance Use Disorder Health Home benefit in participating counties for eligible Medicaid, Healthy Michigan Plan, and MIChild members who need coordinated recovery and health services. Private insurance members should verify the facility, clinicians, pharmacy, and laboratory separately. Ask whether authorization is required for the recommended level of care and what happens if the payer approves a shorter stay than the program initially recommends.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the LARA substance use disorder program license number and verify the approved service categories at that address. Confirm whether the provider is contracted with your regional PIHP, Medicaid plan, Healthy Michigan Plan, or private insurer. Ask who performs the level-of-care assessment and whether the recommendation can be reviewed if your needs change. Find out which medications for opioid or alcohol use disorder are available and whether outside prescriptions will continue. For residential or withdrawal care, ask what medical staff are present, how emergencies are handled, and which hospital receives transfers. Before discharge, request the name of the provider responsible for ongoing medication, counseling, and recovery support.",
      },
    ],
  },
  "new-jersey": {
    intro: "New Jersey has a statewide directory of licensed addiction treatment services and a public insurance program that covers many levels of care. The directory can narrow a search by service type and, for inpatient care, available beds. Still, a listing does not prove that a program is in network for a particular health plan, so licensing and coverage should be confirmed separately.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "Substance use disorder treatment facilities in New Jersey are licensed by the state under standards for residential and outpatient programs. The New Jersey Department of Health licenses and inspects regulated health care facilities, while the Department of Human Services publishes the NJSAMS Treatment Directory of licensed substance use disorder services. The directory includes inpatient and outpatient programs, medication treatment, levels of care, and bed information where available. Search the exact facility and compare its listed services with what the admissions team recommends. Hospitals and primary health care facilities that operate substance use disorder treatment programs may need a separate program license, so a general medical facility license is not enough by itself.",
      },
      {
        heading: "Paying for treatment",
        body: "New Jersey's Medicaid program is NJ FamilyCare. The state reports that Medicaid covers substance use disorder treatment for eligible members and can cover most treatment costs, but the payment path depends on the service and member arrangement. Most NJ FamilyCare benefits are delivered through managed care organizations, and a provider usually must participate in the member's plan network. Some people who need care before full enrollment may be able to apply for temporary Presumptive Eligibility with help from a participating provider. Private insurance members should confirm the exact site, level of care, and billing entities. Ask for written authorization and an estimate of any housing, laboratory, pharmacy, or professional fees billed separately.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the New Jersey substance use disorder facility license and verify the program in the NJSAMS Treatment Directory. Confirm that the approved level of care matches the proposed treatment and ask whether medication treatment is provided on site. Check network status with your specific NJ FamilyCare managed care organization or private plan, using the facility's legal name and address. Ask who obtains authorization, which services may be billed separately, and how financial assistance works if coverage ends. Find out how co-occurring mental health conditions are treated, what licensed staff are present during evenings and weekends, and who will coordinate medications, counseling, and recovery support after discharge.",
      },
    ],
  },
  alabama: {
    intro: "Alabama uses state certification, rather than a general business credential, to oversee community substance use disorder programs. Treatment options and payment routes vary by service and location, so confirm the provider's certification, the exact level of care, and the payer before admission.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Alabama Department of Mental Health, or ADMH, certifies community substance use disorder providers through its Office of Certification. Alabama law requires covered community programs to be certified before providing services, and certified providers must follow the department's Mental Health and Substance Use Services Administrative Code. The certification process includes document review, on-site review, and continuing compliance work. Ask for the ADMH certification tied to the exact location and service. A professional counselor's license or national accreditation does not by itself show that the program is certified for every service it advertises. Use ADMH provider resources to confirm the organization and contact the certification office if the public information is unclear.",
      },
      {
        heading: "Paying for treatment",
        body: "Alabama Medicaid covers eligible behavioral health and substance use disorder services through enrolled providers. Coverage can include assessment, counseling, medication treatment, case management, and other medically necessary services, subject to eligibility and program rules. Alabama has also pursued federal authority to strengthen residential substance use disorder coverage and the continuum of care. State and federal block grant funds may support services for people who are uninsured, but availability is not the same at every provider. Ask Alabama Medicaid and the program to confirm enrollment, authorization requirements, covered service codes, and any charges that Medicaid does not pay. Private insurance members should verify the facility, clinicians, laboratory, pharmacy, and medications separately.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the program's current ADMH certification and the services approved at the address you will attend. Confirm who completes the assessment, which level-of-care criteria are used, and whether medical withdrawal management is provided on site or through another facility. Ask whether the program is enrolled with Alabama Medicaid or in network with your private plan, who obtains authorization, and what you may owe if fewer days are approved. Find out which medications for opioid or alcohol use disorder are available and whether an existing prescription will continue. Ask which licensed or credentialed professionals supervise treatment, how emergencies and co-occurring mental health needs are handled, and what continuing care is arranged before discharge. Request important coverage and cost answers in writing.",
      },
    ],
  },
  alaska: {
    intro: "Alaska's distance and workforce challenges make verification and continuity especially important. The state behavioral health system sets provider standards and manages Medicaid behavioral health reforms, while facility requirements can depend on the service and setting. Confirm both approval and practical access before traveling for care.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Alaska Department of Health, Division of Behavioral Health oversees the state's behavioral health system and administers standards for publicly funded mental health and substance use disorder services. Providers serving Alaska Medicaid members must meet the applicable behavioral health provider conditions in state regulation and enroll for the services they bill. Residential settings can also be subject to separate health facility or residential licensing rules, depending on how the program is organized and whom it serves. Ask the provider to identify the exact state approval, certification, or facility license that applies to its service and location. Check the Division of Behavioral Health resources and do not assume that a general business license, an individual clinician license, or an out-of-state accreditation covers the full program.",
      },
      {
        heading: "Paying for treatment",
        body: "Alaska Medicaid covers eligible substance use disorder treatment through enrolled providers and the state's behavioral health benefit structure, including services authorized through the Section 1115 behavioral health demonstration. Coverage and authorization depend on the member, provider type, service, and clinical need. Travel or telehealth may be part of the plan when local options are limited, but those arrangements should be confirmed before admission. People without Medicaid can ask the Division of Behavioral Health or a community provider about state and federal grant-funded care. Private insurance members should verify network status for the exact site and ask how transportation, lodging, pharmacy, and laboratory services are handled.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask which Alaska approval, certification, or facility license applies to the exact program and request a link or number you can verify. Confirm whether the service is outpatient, intensive outpatient, residential, withdrawal management, or medication treatment, and ask what clinical staff are physically present. Ask whether the provider is enrolled with Alaska Medicaid and whether your service needs prior authorization. If travel is required, get written answers about transportation, lodging, weather delays, and how medications will continue during the trip. Ask how the program coordinates with tribal health organizations, local clinics, or an existing prescriber when relevant. Before admission, identify the provider responsible for follow-up counseling, medication, and recovery support after you return home.",
      },
    ],
  },
  arkansas: {
    intro: "Arkansas licenses substance use disorder treatment programs at the program level and enrolls providers separately for Medicaid payment. Those are different checks. Confirm the license for the location and service first, then confirm that the provider can bill Arkansas Medicaid or your insurance plan.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Arkansas Department of Human Services has authority to license substance abuse treatment programs under the state's Part 433 licensure standards. The rules apply to organizations that operate or present themselves as alcohol or other drug treatment programs, subject to specific statutory exemptions. They cover program operations and services, while hospitals and certain private practices can fall under different oversight. Ask for the current program license associated with the exact address and compare the licensed service with what the admissions team is selling. A clinician's professional license does not replace the program license when program licensure is required. Use the Arkansas rules and official provider information to verify the program and ask the department about any unclear exemption claim.",
      },
      {
        heading: "Paying for treatment",
        body: "Arkansas Medicaid covers eligible behavioral health and substance use disorder services through enrolled providers, with benefits and authorization governed by Medicaid policy and the member's plan. Provider enrollment is separate from state program licensure, so a licensed facility may not be able to bill every Medicaid arrangement. Ask the program for its legal billing name and Medicaid provider information, then confirm the exact location and service with Arkansas Medicaid. People who are uninsured can ask the state's behavioral health office or local providers about block grant and publicly funded treatment. Private insurance members should verify network status, prior authorization, pharmacy benefits, and separate laboratory or professional bills.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the Arkansas substance use treatment program license and confirm that it covers the recommended service at the address you will use. Ask who completed the assessment, why the proposed level of care is appropriate, and whether withdrawal management or medication treatment is actually available on site. Confirm Medicaid enrollment or private insurance network status with both the payer and provider. Request a written estimate that separates treatment, housing, medications, laboratory work, and professional fees. Ask what licensed staff are available during evenings and weekends, how emergencies are transferred, and how co-occurring mental health needs are treated. Finally, ask who will arrange follow-up medication, counseling, and recovery support before discharge.",
      },
    ],
  },
  colorado: {
    intro: "Colorado moved substance use and mental health programs into a unified Behavioral Health Entity licensing system. That makes the state license a useful first check, but Medicaid enrollment and health plan participation remain separate. Verify all three before relying on a provider's marketing.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "Colorado's Behavioral Health Administration, or BHA, licenses Behavioral Health Entities. Since January 1, 2024, a covered behavioral health entity, including a substance use disorder or alcohol use disorder program, generally must hold a BHA license unless a statutory exception applies. Existing programs transitioned from earlier approvals into this system. The license identifies the entity and approved services, so check the exact location rather than only the parent brand. Ask the provider for its BHA license and confirm that the recommended service is included. Individual professional licenses and national accreditation can support quality review, but neither substitutes for the entity license when Colorado law requires one.",
      },
      {
        heading: "Paying for treatment",
        body: "Colorado Medicaid is called Health First Colorado. Behavioral health benefits are organized through regional and managed care arrangements, and covered substance use disorder services depend on clinical need, provider enrollment, network participation, and authorization rules. A BHA license does not guarantee that the provider accepts Health First Colorado or your regional plan. Call the number on the member card with the provider's legal name, address, and proposed level of care. Uninsured residents can ask the BHA and local behavioral health system about publicly funded options. Private insurance members should verify facility, clinician, medication, laboratory, and transportation benefits separately and request a written cost estimate.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the current BHA license number and confirm the approved services at the location. Ask whether the program uses current level-of-care criteria and who performs the assessment. Confirm Health First Colorado enrollment and the provider's contract with your regional organization, or verify private insurance network status with the plan. Ask who obtains authorization and what happens if the payer approves less care than the program recommends. Find out which medications for opioid or alcohol use disorder are available, whether current prescriptions continue, and what medical staff are present for residential or withdrawal care. Before admission, request written information about costs, discharge planning, and the provider who will continue care near home.",
      },
    ],
  },
  connecticut: {
    intro: "Connecticut licenses several substance use treatment settings as health care institutions and uses a separate Medicaid certification and payment process. Checking only a brand name is not enough. Confirm the facility category, address, approved service, and Medicaid or insurance participation before admission.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Connecticut Department of Public Health, through its Facility Licensing and Investigations Section, licenses health care institutions that include facilities for the care or treatment of people with substance use disorders. The licensed category and scope matter because residential, outpatient, hospital, and other behavioral health settings can follow different rules. Use the department's facility information and ask the program for the license tied to the exact site. Connecticut's Department of Mental Health and Addiction Services also operates and funds parts of the public treatment system, but funding or referral status does not replace a required Department of Public Health license. Verify professional credentials separately for the clinicians who will provide care.",
      },
      {
        heading: "Paying for treatment",
        body: "Connecticut Medicaid is called HUSKY Health. The state uses Medicaid coverage and its substance use disorder demonstration authority to pay eligible enrolled providers for outpatient, intermediate, residential, inpatient, and medication services when program requirements are met. Coverage still depends on eligibility, medical necessity, provider certification or enrollment, and authorization. Call HUSKY Health with the exact facility and service before admission. If you are uninsured, ask the state access line or a Department of Mental Health and Addiction Services funded provider about publicly supported care. Private insurance members should confirm the facility, individual professionals, pharmacy, laboratory, and any transportation or housing charges separately.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the Connecticut facility license and verify the category and address with the Department of Public Health. Ask whether the proposed level of care is covered by that license and whether any service is delivered by another organization. Confirm HUSKY Health enrollment or private plan network status using the legal billing name. Ask who completes authorization, which charges fall outside the covered clinical benefit, and what happens after a denial or shortened approval. Find out whether medication treatment is available without delay, which licensed professionals direct care, and how medical emergencies are handled. Request the discharge plan, including the name of the local prescriber or counselor who will continue care.",
      },
    ],
  },
  delaware: {
    intro: "Delaware regulates substance use treatment programs through its behavioral health system and offers both Medicaid and publicly funded routes into care. A provider's state license, Medicaid certification, and managed care contract answer different questions, so verify each one that applies.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Delaware Division of Substance Abuse and Mental Health, or DSAMH, licenses substance use treatment and rehabilitation programs under state law and the Delaware Administrative Code. Covered programs must be licensed before operating, with standards that apply to outpatient, residential, medication, and co-occurring treatment settings. Ask for the DSAMH license associated with the exact site and service. Delaware also licenses individual chemical dependency professionals through the Division of Professional Regulation, but an individual credential does not replace a program license. Recovery housing can follow a different certification framework, so ask whether the residence provides clinical treatment and which entity holds the treatment license.",
      },
      {
        heading: "Paying for treatment",
        body: "Delaware Medicaid is administered by the Division of Medicaid and Medical Assistance and delivers many benefits through managed care organizations. Substance use services must be provided by appropriately qualified, enrolled, and, where required, licensed or certified providers. Network participation and authorization can vary by plan. DSAMH also contracts with programs that provide publicly funded treatment for some people who are uninsured or whose insurance is insufficient. Contact the Delaware Hope Line, a DSAMH Bridge Clinic, or the Medicaid plan to understand the route that applies. Ask for a written explanation of covered clinical services and any separate housing, medication, laboratory, or professional charges.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the current DSAMH program license and verify the location and approved service. Confirm whether the provider participates in your Delaware Medicaid managed care plan or private insurance network and who obtains authorization. Ask if publicly funded treatment is available when coverage is absent or incomplete. Find out which medications for opioid or alcohol use disorder are offered, whether they are available on site, and whether the program will continue an existing prescription. Ask which licensed professionals supervise treatment, how withdrawal risks and medical emergencies are managed, and whether housing is billed separately from clinical care. Before admission, request the discharge and follow-up plan in writing.",
      },
    ],
  },
  hawaii: {
    intro: "Hawaii separates accreditation of substance use programs from facility licensing for certain residential settings. Island geography can also affect travel and continuity. Confirm the program's approval, any required facility license, Medicaid plan participation, and follow-up arrangements before starting care.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Hawaii Department of Health, Alcohol and Drug Abuse Division, or ADAD, accredits substance use disorder treatment programs under state standards. Special Treatment Facilities and Therapeutic Living Programs are licensed through the Department of Health's Office of Health Care Assurance, and ADAD accreditation can be a co-requisite for applicable facility licensing or state funding. Ask the provider which approval applies to the service and exact address, then check the current ADAD accredited-provider information and any Office of Health Care Assurance facility record. A professional license or accreditation from a national organization does not by itself establish that the Hawaii program has every required state approval.",
      },
      {
        heading: "Paying for treatment",
        body: "Hawaii's Medicaid program is administered by the Department of Human Services Med-QUEST Division, with most benefits delivered through managed care plans. Covered substance use services depend on eligibility, clinical need, provider enrollment, the member's plan, and authorization. ADAD funds may support qualifying treatment or recovery services when Medicaid or other insurance does not cover the full need, but funding and openings vary. Call the Med-QUEST plan and the provider with the exact site and service. When inter-island travel is involved, ask separately about transportation, lodging, pharmacy access, and how care continues after returning home.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask whether the program is ADAD accredited and, for a residential setting, whether it holds the applicable Office of Health Care Assurance license. Verify the approved services at the exact location. Confirm Med-QUEST enrollment and participation in your managed care plan, then ask who obtains authorization and what charges remain. Ask which medications for opioid or alcohol use disorder are available and whether your existing prescription will continue. If travel is required, get a written plan for transportation, medication supply, family contact, and emergency transfer. Before admission, identify the counselor, clinic, or prescriber that will provide continuing care on your home island.",
      },
    ],
  },
  idaho: {
    intro: "Idaho uses different approval paths for different substance use treatment settings, so there is not one credential that answers every question. Publicly funded services follow Division of Behavioral Health standards, and Medicaid residential services have additional certification and enrollment requirements.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Idaho Department of Health and Welfare, Division of Behavioral Health, oversees the public substance use disorder services system and contracts for treatment and recovery support. Requirements depend on the service and setting. Providers seeking to deliver Medicaid residential substance use disorder care must meet the state's residential facility standards, certification process, and applicable facility requirements before enrollment. Other residential settings can require a separate facility license based on the population served. Ask the program to name the exact Idaho approval, certification, or license for its site and service. Do not treat participation in a referral network, an individual clinician license, or national accreditation as a substitute for the state requirement that applies to the program.",
      },
      {
        heading: "Paying for treatment",
        body: "Idaho Medicaid covers eligible substance use disorder services through enrolled providers. Current state plan materials include medically necessary residential services at specified levels of care, with assessment, plan-of-care, authorization, and provider requirements. Coverage does not automatically include room and board or every nonclinical charge. Public treatment funds administered through the Division of Behavioral Health may help qualifying people who lack adequate coverage. Ask Idaho Medicaid and the provider to confirm the exact service, authorization, and billing entity. Private insurance members should verify the facility, professionals, medications, laboratory work, and any housing costs separately.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask which Idaho approval or certification covers the exact program and whether a separate facility license applies. Confirm the approved level of care, staff qualifications, and emergency transfer plan. Ask whether the provider is enrolled with Idaho Medicaid for the proposed service and whether prior authorization is required. Get a written estimate separating clinical treatment, room and board, medications, laboratory work, and other charges. Ask whether medications for opioid or alcohol use disorder are offered and whether existing prescriptions continue. Find out how co-occurring mental health needs are treated and which local provider will handle counseling, medication, and recovery support after discharge.",
      },
    ],
  },
  indiana: {
    intro: "Indiana certifies addiction treatment providers through its state behavioral health agency and applies additional designation and enrollment rules to Medicaid residential care. Verify the provider's certification, service designation, and Indiana Medicaid participation before assuming that a location is approved or covered.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Indiana Family and Social Services Administration, Division of Mental Health and Addiction, or DMHA, certifies addiction treatment service providers under 440 IAC 4.4. Residential addiction facilities seeking to provide certain Medicaid levels of care must first hold the relevant DMHA certifications and obtain an American Society of Addiction Medicine level-of-care designation from DMHA. Ask for the certification and designation tied to the exact address and program. A professional license held by a counselor does not replace the agency certification. Opioid treatment programs also must meet federal certification and controlled substance requirements in addition to state requirements. Use DMHA provider information to confirm the program and services.",
      },
      {
        heading: "Paying for treatment",
        body: "Indiana Medicaid is administered through the Indiana Health Coverage Programs, or IHCP. Eligible members can receive covered substance use disorder services through enrolled providers, including qualifying short-term residential treatment when program and authorization requirements are met. A DMHA-certified facility must also enroll under the correct IHCP provider type and specialty to bill Medicaid for residential addiction treatment. Call the member's plan with the legal provider name, location, and recommended service. Publicly funded options may be available through DMHA contractors for people without adequate coverage. Private insurance members should verify facility, clinician, pharmacy, laboratory, and medication benefits separately.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the DMHA addiction treatment service certification and, for residential care, the applicable level-of-care designation. Verify that each belongs to the location you will attend. Confirm the provider's IHCP enrollment and managed care contract, or its private insurance network status, before admission. Ask who obtains prior authorization and what happens if the approved stay is shorter than recommended. Find out which medications for opioid or alcohol use disorder are available and whether the program will continue a current prescription. Ask what clinical and medical staff are present, how emergencies are handled, and which provider will continue medication, counseling, and recovery support after discharge.",
      },
    ],
  },
  iowa: {
    intro: "Iowa licenses substance use disorder treatment programs through the state health department and regulates specific program types under Chapter 155. Medicaid payment is a separate check. Confirm the program license, approved service, and Iowa Medicaid participation before choosing care.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "Iowa Health and Human Services licenses and monitors substance use disorder and problem gambling treatment programs. Iowa Administrative Code Chapter 155 sets licensure standards for program operations, including outpatient, residential, opioid treatment, and other covered services. State law generally requires a written program license before operating a residential or nonresidential treatment program, subject to listed exemptions. Ask for the license tied to the exact address and compare the licensed service with the proposed level of care. Iowa permits deemed status in some circumstances for qualifying accredited programs, but the provider should still be able to show its current state licensure status. Verify individual professional credentials separately.",
      },
      {
        heading: "Paying for treatment",
        body: "Iowa Medicaid delivers many benefits through Iowa Health Link managed care organizations. Covered substance use disorder services depend on eligibility, medical necessity, provider enrollment, network participation, and any authorization requirements. A state treatment license does not guarantee that the location is contracted with every Medicaid plan. Call the plan with the provider's legal name, address, and recommended service. People without adequate insurance can ask Iowa HHS or local programs about block grant and state-supported treatment. Private insurance members should verify the facility and clinicians, as well as pharmacy, laboratory, transportation, and any nonclinical housing charges.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the Iowa substance use disorder program license and confirm the approved service and address. Ask whether the program operates under deemed status and which state records support its current approval. Confirm Iowa Medicaid enrollment and participation in your Iowa Health Link plan, or verify private insurance network status. Ask who completes authorization and what you may owe if coverage is limited. Find out whether medication treatment is offered on site, which licensed professionals direct care, and how withdrawal or medical emergencies are handled. Request a written cost estimate and a discharge plan that names the provider responsible for continuing medication, counseling, and recovery support near home.",
      },
    ],
  },
  kansas: {
    intro: "Kansas licenses substance use disorder treatment facilities through its behavioral health licensing division and delivers Medicaid through KanCare plans. Licensure, Medicaid enrollment, and a plan contract are separate requirements, so verify each before relying on a provider's coverage claim.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Kansas Department for Aging and Disability Services, or KDADS, Behavioral Health Licensing Division licenses substance use disorder treatment facilities. Kansas law requires covered treatment facilities to hold a license, and KDADS uses application review, surveys, and complaint follow-up to monitor compliance. The license and approved modalities are tied to the program and location. Ask for the current KDADS license and confirm that it covers the recommended outpatient, residential, or other service. An individual counselor credential or national accreditation does not replace facility licensure. Search the state program list or contact KDADS when the organization's name, address, or approved service does not match what is being advertised.",
      },
      {
        heading: "Paying for treatment",
        body: "Kansas Medicaid is delivered through KanCare managed care organizations. A substance use disorder provider generally must be licensed as required, enrolled in the Kansas Medical Assistance Program, and contracted with the member's KanCare plan to be treated as in network. The plans can use separate behavioral health administrators and authorization processes. Call the plan with the provider's legal name, address, and proposed level of care. KDADS also administers block grant and other public treatment funds through contracted providers, which may help people who are uninsured or underinsured. Private insurance members should verify clinical, pharmacy, laboratory, and housing charges separately.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the KDADS treatment facility license and confirm the location and approved modalities. Verify active Kansas Medicaid enrollment and a contract with your exact KanCare plan, or confirm private insurance network status directly with the payer. Ask who obtains authorization, what clinical criteria are used, and what happens if the payer approves less care than recommended. Find out which medications for opioid or alcohol use disorder are available and whether current prescriptions continue. Ask what licensed staff are present during residential care, how emergencies are transferred, and whether public funding is available if coverage ends. Request written cost and discharge information before admission.",
      },
    ],
  },
  kentucky: {
    intro: "Kentucky licenses outpatient and residential addiction treatment organizations as Alcohol and Other Drug Entities. Medicaid enrollment and managed care participation are separate. Confirm the facility's AODE license, the service it covers, and payer approval before committing to treatment.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Kentucky Cabinet for Health and Family Services oversees the Alcohol and Other Drug Entity, or AODE, licensure program through its behavioral health regulatory structure. The program licenses, regulates, and inspects covered outpatient and residential substance use disorder treatment facilities. Ask for the current AODE license tied to the exact address and confirm that the approved service matches what the admissions team recommends. Kentucky publishes licensed program information that can be used for verification. Individual professional credentials, a recovery residence designation, or national accreditation do not replace an AODE license when the program is required to hold one. Opioid treatment programs also have federal certification requirements.",
      },
      {
        heading: "Paying for treatment",
        body: "Kentucky Medicaid covers eligible substance use disorder services through enrolled providers and managed care organizations. Coverage can depend on the service, clinical need, network, and prior authorization. A licensed AODE must also meet Medicaid enrollment and plan contracting requirements to bill a member's coverage. Call the managed care plan with the provider's legal billing name, address, and level of care. The state behavioral health system and local providers may have grant-funded options for people without adequate insurance. Private insurance members should confirm facility, professional, medication, laboratory, and transportation benefits, and ask whether housing or recovery residence charges are outside the clinical benefit.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the AODE license number and verify the location and approved service. Confirm Kentucky Medicaid enrollment and participation in your managed care plan, or verify private insurance network status. Ask who completes the assessment, which level-of-care criteria are used, and who handles authorization. Find out which medications for opioid or alcohol use disorder are available, whether current prescriptions continue, and what medical support is present during withdrawal or residential treatment. Ask how co-occurring mental health conditions are managed and which charges are billed separately. Before admission, request the continuing-care plan, including the provider responsible for medication and counseling after discharge.",
      },
    ],
  },
  louisiana: {
    intro: "Louisiana licenses organizations that provide addiction treatment as Behavioral Health Service providers. The state license, Healthy Louisiana plan enrollment, and authorization are separate checks. Verify the exact facility and service before paying or traveling for treatment.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Louisiana Department of Health, Health Standards Section, licenses Behavioral Health Service providers under Louisiana Administrative Code Title 48. The license can cover mental health services, substance use or addiction treatment, or both, and the provider must obtain approval for its designated location and off-site arrangements. Residential substance use programs are subject to additional service and facility standards. Ask for the license associated with the exact address and confirm that the proposed level of care is included. Louisiana publishes licensed provider information by region. Professional licenses and national accreditation are useful checks, but they do not replace the Behavioral Health Service provider license when state rules require one.",
      },
      {
        heading: "Paying for treatment",
        body: "Louisiana Medicaid delivers most benefits through Healthy Louisiana managed care plans. Covered behavioral health and substance use disorder services depend on eligibility, medical necessity, provider enrollment, plan network, and authorization rules. A state facility license does not prove that every Healthy Louisiana plan treats the program as in network. Call the plan using the legal billing name, address, and proposed service. The Office of Behavioral Health also supports publicly funded services for qualifying people, but availability differs by region and program. Private insurance members should verify the facility, clinicians, medication, laboratory, and any residential or transportation costs separately.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the Louisiana Behavioral Health Service provider license and verify the address, ownership, and approved services. Confirm Medicaid enrollment and participation in your exact Healthy Louisiana plan, or verify private insurance network status. Ask who obtains authorization and how the program responds if additional days are denied. Find out whether medication treatment is provided on site and whether the program will continue an existing prescription. For residential care, ask what clinical and medical staff are present and how emergencies are transferred. Request a written estimate that separates treatment, housing, pharmacy, laboratory, and professional charges, plus a discharge plan naming the next provider.",
      },
    ],
  },
  maine: {
    intro: "Maine licenses substance use disorder treatment agencies separately from mental health agencies, even when one organization offers both. MaineCare participation is another requirement. Confirm the treatment license, location, approved service, and payer arrangement before starting care.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Maine Department of Health and Human Services, Division of Licensing and Certification, licenses substance use disorder treatment agencies under the state's Behavioral Health Program. Providers offering both mental health and substance use services generally need separate licenses for the two agency types. Maine law authorizes inspection and approval of public and private treatment facilities, while qualifying national accreditation can support deemed compliance with comparable rules. Ask for the current substance use disorder agency license and verify the exact address and service. Do not rely only on a mental health license, individual clinician credential, or accreditation certificate when a separate substance use agency license is required.",
      },
      {
        heading: "Paying for treatment",
        body: "Maine's Medicaid program is MaineCare. It covers eligible substance use disorder services through enrolled providers, subject to member eligibility, clinical criteria, provider qualifications, and authorization rules. Maine also operates a substance use disorder care demonstration that supports qualifying short-term services in certain residential settings. A state license does not guarantee MaineCare enrollment for every service or location. Call MaineCare with the provider's legal name and proposed level of care. Uninsured residents can ask the Office of Behavioral Health or local providers about state and block grant funding. Private insurance members should confirm facility, professional, medication, laboratory, and housing charges separately.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the Maine substance use disorder treatment agency license and verify the location and approved service. If the organization also treats mental health conditions, ask which separate license covers that work. Confirm MaineCare enrollment and any authorization requirement, or verify private plan network status directly. Ask who performs the assessment, what medical support is available, and whether medications for opioid or alcohol use disorder are offered without delay. Request a written estimate that separates covered treatment from room, board, laboratory, pharmacy, or outside professional charges. Before admission, ask who coordinates continuing medication, counseling, and recovery support after discharge.",
      },
    ],
  },
  maryland: {
    intro: "Maryland licenses community behavioral health programs under service-specific rules and uses separate Medicaid enrollment and managed care processes. Verify the license for the exact program and level of care, not only the parent organization's name or accreditation.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Maryland Department of Health licenses community-based behavioral health programs under COMAR 10.63. The rules cover substance-related disorder assessment, outpatient, intensive outpatient, residential, withdrawal management, opioid treatment, and integrated behavioral health services. Programs can follow accreditation-based or non-accreditation-based licensing paths depending on the service, but both require current state approval. Ask for the license associated with the exact site and compare the licensed service with the recommended level of care. National accreditation and individual professional credentials do not establish that every location is licensed for every advertised service. Use state program information or contact the licensing office when the details do not match.",
      },
      {
        heading: "Paying for treatment",
        body: "Maryland Medicaid covers eligible substance use disorder services through enrolled providers and the member's managed care arrangement or other Medicaid delivery system. Coverage depends on medical necessity, provider qualifications, network status, and authorization. A COMAR license does not guarantee that the program is enrolled or contracted for the proposed service. Call the plan with the legal billing name, address, and service level. Maryland's public behavioral health system may support qualifying services for people without adequate insurance. Private insurance members should confirm the facility, clinicians, medications, laboratory work, and any room or board charge separately and request a written estimate.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the Maryland behavioral health program license and verify the location, service type, and current status. Ask whether the license is accreditation-based and which accrediting organization is current. Confirm Medicaid enrollment and managed care participation, or private insurance network status, before admission. Ask who obtains authorization and what happens after a denial or reduced approval. Find out which medications for opioid or alcohol use disorder are available and whether existing prescriptions continue. For residential or withdrawal care, ask what medical staff are present and how emergencies are handled. Request the expected charges and continuing-care plan in writing.",
      },
    ],
  },
  massachusetts: {
    intro: "Massachusetts licenses substance use disorder treatment programs through a dedicated state bureau and applies service-specific rules to outpatient, residential, withdrawal, and opioid treatment. MassHealth participation is separate. Confirm both the program license and payment arrangement before admission.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Massachusetts Department of Public Health, Bureau of Substance Addiction Services, or BSAS, licenses and approves substance use disorder treatment programs under 105 CMR 164. The rules cover 24-hour diversionary services, outpatient services, opioid treatment programs, and residential rehabilitation. BSAS operates a public program lookup. Search the exact location and compare the licensed service with what is being recommended. Massachusetts does not label every commonly used marketing term as a separate BSAS service category, so ask the program to identify the licensed service behind terms such as intensive outpatient or partial hospitalization. Individual clinician licenses and national accreditation do not replace BSAS program licensure where it is required.",
      },
      {
        heading: "Paying for treatment",
        body: "Massachusetts Medicaid is called MassHealth. Its substance use disorder treatment regulations require participating programs to hold the appropriate Department of Public Health license or approval and to enroll for the covered service and location. Benefits depend on the member's coverage type, managed care arrangement, clinical need, and authorization rules. Confirm the program's MassHealth provider status and exact site before admission. State-supported access programs may help people who are uninsured or need navigation. Private insurance members should verify facility and professional networks, medications, laboratory work, and any recovery residence or transportation charge separately.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the BSAS license or approval and verify the service and address in the state lookup. If the provider uses a marketing term that is not a BSAS license category, ask which licensed service will actually be billed. Confirm MassHealth enrollment and managed care participation, or private insurance network status. Ask who handles authorization and what happens if the payer approves a shorter stay. Find out which medications for opioid or alcohol use disorder are available, whether current prescriptions continue, and what medical coverage exists after hours. Request a written estimate and a discharge plan identifying the next prescriber, counselor, and recovery support.",
      },
    ],
  },
  minnesota: {
    intro: "Minnesota licenses substance use disorder treatment programs under a detailed state statute that identifies approved services and special populations. Medicaid payment follows a separate enrollment and authorization path. Confirm the license, service, and payer before choosing a program.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Minnesota Department of Human Services licenses substance use disorder treatment programs under Minnesota Statutes Chapter 245G and the Human Services Licensing Act. Programs may be licensed as outpatient or residential and can hold additional approvals for adolescent treatment, co-occurring mental health care, clients with children, or opioid treatment. Ask for the 245G license tied to the exact address and verify it through the DHS licensing lookup. Compare the listed services with what the admissions team recommends. Residential programs serving minors can also fall under children's residential rules. Individual professional licenses and national accreditation do not replace the 245G program license when it is required.",
      },
      {
        heading: "Paying for treatment",
        body: "Minnesota Medical Assistance covers eligible substance use disorder services through enrolled providers, with payment depending on the member, service, provider status, managed care arrangement, and authorization requirements. A program's 245G license does not prove that it participates in every health plan. Call the number on the member card using the provider's legal name, address, and recommended service. County and tribal resources can also help eligible residents access publicly funded care. Private insurance members should verify the facility, clinicians, medications, laboratory work, transportation, and any room or board charge separately. Ask for a written estimate before admission.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the Minnesota 245G license and verify the address and approved services. If you need adolescent, co-occurring, or clients-with-children programming, confirm that the additional approval appears on the license. Ask whether the provider is enrolled with Medical Assistance and contracted with your managed care plan, or in network with private insurance. Confirm authorization responsibilities and appeal options. Find out which medications for opioid or alcohol use disorder are available and whether current prescriptions continue. Ask how medical emergencies are handled, what staff are present after hours, and who will coordinate counseling, medication, and recovery support after discharge.",
      },
    ],
  },
  mississippi: {
    intro: "Mississippi certifies substance use disorder programs through the Department of Mental Health rather than using one broad facility license. Medicaid enrollment is separate. Confirm the program's certification, approved services, and payment arrangement before admission.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Mississippi Department of Mental Health, Division of Certification, certifies agency providers for substance use disorder community services under the department's Operational Standards. New providers complete orientation, submit an application, and must maintain compliance for approved programs and services. Mississippi publishes a directory of certified providers. Search the exact organization and county, then ask for the certification documents covering the location and recommended service. A counselor's professional license, an individual addiction credential, or national accreditation does not replace agency certification when DMH certification is required for the program. Verify any separate hospital or health facility license when care is delivered in that setting.",
      },
      {
        heading: "Paying for treatment",
        body: "Mississippi Medicaid covers eligible behavioral health and substance use disorder services through enrolled providers and the member's delivery arrangement, including MississippiCAN managed care for many members. DMH certification and Medicaid enrollment are separate requirements. Call the plan with the provider's legal billing name, address, and proposed service to confirm network and authorization rules. DMH also directs state and federal funds to certified community providers, which may support care for qualifying people without adequate insurance. Private insurance members should verify the facility, professionals, medications, laboratory work, and residential charges separately. Ask which services are covered and which are funded through another source.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for current DMH certification and confirm the approved program and service at the location. Verify Mississippi Medicaid enrollment and MississippiCAN plan participation, or private insurance network status. Ask who completes the assessment, which level-of-care criteria are used, and who obtains authorization. Find out whether medication treatment is available on site, whether existing prescriptions continue, and how medical emergencies are handled. Ask which staff hold professional licenses or DMH credentials and who supervises direct care. Request a written estimate that identifies separately billed items and a discharge plan naming the provider responsible for continuing medication, counseling, and recovery support.",
      },
    ],
  },
  missouri: {
    intro: "Missouri's certification rules depend on how a treatment organization is funded and whether it participates in the state service network. Medicaid substance use care is commonly delivered through certified programs. Confirm the program's status and payer participation instead of assuming every private provider follows the same path.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Missouri Department of Mental Health, Division of Behavioral Health, certifies organizations that contract with the department, participate in authorized service networks, receive certain public funds, or seek reimbursement through designated Medicaid programs such as Comprehensive Substance Treatment and Rehabilitation, known as CSTAR. Missouri states that non-contracted private agencies are not universally required to obtain the same certification unless another rule applies. Ask the provider whether it is DMH certified, nationally accredited, privately operated outside the state network, or subject to another facility license. Use the DMH certified-provider directory to verify claims. Also confirm the professional licenses of clinicians and any federal approval required for opioid treatment.",
      },
      {
        heading: "Paying for treatment",
        body: "Missouri Medicaid is called MO HealthNet. CSTAR provides covered services for members assessed as needing treatment for alcohol or substance use disorders through qualifying certified and enrolled programs. Residential coverage can be available under Missouri's approved substance use disorder demonstration when program and clinical requirements are met. Certification does not guarantee participation in every managed care arrangement. Call MO HealthNet or the plan with the provider's legal name, location, and service. People without coverage can ask DMH-funded programs about eligibility and openings. Private insurance members should verify facility, professional, medication, laboratory, and housing charges separately.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask whether the organization is DMH certified and verify it in the state directory. If it is not certified, ask which law, facility license, accreditation, and professional credentials govern the program and why DMH certification is not required. Confirm CSTAR or other MO HealthNet enrollment and plan participation, or private insurance network status. Ask who obtains authorization and how a reduced approval is handled. Find out which medications for opioid or alcohol use disorder are offered, what medical staff are present, and how emergencies are transferred. Before admission, request written costs and a continuing-care plan that identifies the next provider.",
      },
    ],
  },
  montana: {
    intro: "Montana uses both facility licensure and state approval for substance use disorder programs, depending on the setting and funding. Medicaid enrollment follows those steps. Confirm the applicable license, state approval, service level, and payment arrangement before treatment begins.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Montana Department of Public Health and Human Services oversees substance use disorder facilities through facility licensure and the Behavioral Health and Developmental Disabilities Division's State Approval process. Substance use disorder facilities begin the licensing process through the Office of Inspector General, then qualifying programs apply for state approval for specific levels of care and specialty services under Title 53 and state rules. State-approved facilities receive periodic compliance review. Ask for both the active facility license and state approval when they apply, tied to the exact county location and service. Individual clinician licenses or national accreditation do not replace these program-level requirements.",
      },
      {
        heading: "Paying for treatment",
        body: "Montana Medicaid covers eligible substance use disorder services through enrolled and appropriately approved providers. State-approved treatment programs can enroll to bill covered services, and current Medicaid rules and provider manuals govern authorization and level-of-care requirements. Montana also has federal authority that expands access to qualifying inpatient and residential treatment in larger facilities. Coverage still depends on member eligibility, medical necessity, provider enrollment, and the exact service. Ask Montana Medicaid and the program to confirm authorization and costs. Uninsured residents can ask about block grant or county-supported options. Private insurance members should verify each billing entity separately.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the Montana facility license and state approval that cover the location and proposed level of care. Verify whether both are current. Confirm Montana Medicaid enrollment or private insurance network status, and ask who handles authorization. Request a written estimate that separates treatment, room and board, medication, laboratory, and outside professional charges. Find out whether medications for opioid or alcohol use disorder are available and whether existing prescriptions continue. Ask what medical staff are present for residential or withdrawal services, how emergency transfers work, and which provider will continue medication, counseling, and recovery support after discharge.",
      },
    ],
  },
  nebraska: {
    intro: "Nebraska licenses residential mental health and substance use treatment centers through its health facility licensure unit. Outpatient services may follow different professional and provider rules. Medicaid coverage runs mainly through Heritage Health plans, so verify both regulation and network status.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Nebraska Department of Health and Human Services, Division of Public Health Licensure Unit, licenses Mental Health Substance Use Treatment Centers under Title 175. These facilities provide shelter, food, counseling, supervision, diagnosis, and treatment for people living at the site for more than 24 consecutive hours. The state inspects a center before initial licensure and can conduct unannounced compliance inspections. Ask for the current license associated with the exact location and services. A relocation or ownership change requires new approval. Outpatient clinics and individual practitioners can follow different licensing and accreditation rules, so ask the provider to identify the specific authority that applies to its setting.",
      },
      {
        heading: "Paying for treatment",
        body: "Nebraska Medicaid delivers most medical and behavioral health benefits through Heritage Health managed care plans. A licensed treatment center must also meet Medicaid provider and accreditation requirements for covered services. Network participation and authorization differ by plan. Call the Heritage Health plan using the legal billing name, address, and recommended service. State behavioral health funds may support qualifying services for people without adequate coverage, but availability varies. Private insurance members should confirm facility, professional, medication, laboratory, transportation, and housing charges separately. Ask whether the provider is accredited for the exact level of care it proposes.",
      },
      {
        heading: "Questions to ask providers",
        body: "For residential care, ask for the Nebraska Mental Health Substance Use Treatment Center license and verify the address. Ask which accreditation covers the proposed level of care. For outpatient care, ask which clinic and professional licenses apply. Confirm Medicaid enrollment and participation in your Heritage Health plan, or private insurance network status. Ask who obtains authorization and what happens if coverage changes. Find out which medications for opioid or alcohol use disorder are offered, what medical staff are present, and how emergencies are handled. Request written costs and the name of the provider who will continue medication, counseling, and recovery support after discharge.",
      },
    ],
  },
  nevada: {
    intro: "Nevada regulates substance use treatment through both health facility licensing and behavioral health program certification. The requirements depend on the setting. Medicaid enrollment is separate, so confirm the facility, program, service, and payment status before admission.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Nevada Department of Health and Human Services, Division of Public and Behavioral Health, licenses facilities for treatment of alcohol or other substance use disorders under NRS and NAC Chapter 449. The division also certifies substance use prevention, treatment, and recovery programs under Chapter 458 through its behavioral health authority. A residential program may need both the relevant facility license and program certification. Ask for each approval tied to the exact address and proposed service, then use Nevada's published licensing information to verify status. A halfway house, recovery residence, medical detoxification facility, or outpatient program can follow different requirements, so do not assume one approval covers every setting.",
      },
      {
        heading: "Paying for treatment",
        body: "Nevada Medicaid covers eligible substance use treatment services through enrolled providers and uses distinct provider types for outpatient behavioral health, residential facilities, and substance use treatment. Coverage depends on eligibility, medical necessity, provider enrollment, managed care network, and authorization. A state license or certification does not guarantee Medicaid payment. Call the plan with the provider's legal name, address, and service. State behavioral health funds may support qualifying treatment for uninsured residents. Private insurance members should verify the facility, clinicians, medication, laboratory, and any housing charges separately. Ask who bills each component before admission.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask which Nevada facility license and Chapter 458 certification apply to the exact program. Verify the address, service category, and current status. Confirm Nevada Medicaid enrollment and managed care participation, or private insurance network status, directly with the payer. Ask who obtains authorization and which charges are outside the clinical benefit. Find out whether medication treatment is available on site, whether existing prescriptions continue, and what licensed medical staff are present for detoxification or residential care. Ask how co-occurring mental health needs are treated and request a discharge plan identifying the next prescriber, counselor, and recovery support provider.",
      },
    ],
  },
  "new-hampshire": {
    intro: "New Hampshire uses facility licensing for residential substance use treatment and separate Medicaid enrollment rules for outpatient and comprehensive programs. Verify the setting, license, provider qualifications, and payer arrangement before accepting a recommendation.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The New Hampshire Department of Health and Human Services licenses residential treatment and rehabilitation facilities under RSA 151 and He-P 807 through its health facility licensing function. The state also designates and contracts with community substance use disorder programs under the New Hampshire substance use services system. Outpatient and comprehensive programs must meet applicable provider and professional requirements, including licensed alcohol and drug counselors for covered clinical work. Ask the organization which facility license, program designation, and professional credentials apply to the exact service and address. A community contract, counselor license, or national accreditation does not by itself establish that a residential facility holds the required license.",
      },
      {
        heading: "Paying for treatment",
        body: "New Hampshire Medicaid covers eligible substance use disorder treatment and recovery support through enrolled outpatient and comprehensive programs, with service definitions and provider qualifications in state rules and manuals. Coverage can include outpatient, intensive outpatient, partial hospitalization, residential, and medication services when requirements are met. Network and authorization rules depend on the member's Medicaid arrangement. Call the plan with the legal provider name and exact service. Publicly funded providers may help uninsured residents access care. Private insurance members should verify facility, clinician, medication, laboratory, transportation, and room or board charges separately.",
      },
      {
        heading: "Questions to ask providers",
        body: "For residential care, ask for the New Hampshire facility license and verify the address. For outpatient care, ask whether the program is enrolled as an outpatient or comprehensive substance use disorder provider and which licensed professionals deliver services. Confirm Medicaid plan participation or private insurance network status, and ask who obtains authorization. Find out which medications for opioid or alcohol use disorder are available and whether current prescriptions continue. Ask what medical staff are present, how emergency transfer works, and whether any service is provided by a separate organization. Request written costs and the name of the continuing-care provider before admission.",
      },
    ],
  },
  "new-mexico": {
    intro: "New Mexico's behavioral health system combines health facility oversight, state behavioral health requirements, and Medicaid managed care. The exact approval depends on the setting and service. Confirm the provider's authority, Turquoise Care participation, and authorization before treatment.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "New Mexico regulates treatment settings through the state health facility licensing system and the Health Care Authority's Behavioral Health Services Division. Residential, hospital, outpatient, and opioid treatment services can follow different facility, program, and professional requirements. Ask the provider to identify the exact New Mexico license or certification that covers the location and service, then verify it through the responsible state division. Do not assume that enrollment in a referral directory, a clinician's individual license, or national accreditation authorizes every service at every site. Opioid treatment programs also need federal certification and controlled substance registration in addition to state approval.",
      },
      {
        heading: "Paying for treatment",
        body: "New Mexico Medicaid operates managed care under Turquoise Care. Covered behavioral health and substance use disorder services depend on eligibility, clinical need, provider enrollment, plan network, and authorization rules. A state facility or program approval does not guarantee participation in every Turquoise Care plan. Call the plan with the provider's legal billing name, address, and recommended service. The Behavioral Health Services Division also funds community services that may help qualifying people without adequate insurance. Private insurance members should verify the facility, professionals, medications, laboratory work, transportation, and any housing charges separately.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask which New Mexico license or program approval covers the exact service and address, and verify it with the state. Confirm Medicaid enrollment and participation in your Turquoise Care plan, or private insurance network status, before admission. Ask who completes the assessment, which criteria support the proposed level of care, and who handles authorization. Find out whether medications for opioid or alcohol use disorder are offered and whether a current prescription will continue. Ask what medical staff are present for residential or withdrawal care, how emergencies are handled, and which provider will continue medication, counseling, and recovery support after discharge.",
      },
    ],
  },
  "north-dakota": {
    intro: "North Dakota licenses substance use disorder treatment programs through its state behavioral health system and separately enrolls providers for Medicaid. The state also offers a voucher program for some services. Verify the license, payment route, and service before admission.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "North Dakota Health and Human Services, Behavioral Health Division, licenses substance use disorder treatment programs and publishes a directory organized by level of care. State rules distinguish outpatient, intensive outpatient, residential, opioid treatment, and other services. Opioid treatment programs must also obtain federal certification and controlled substance registration. Ask for the current state program license tied to the exact address and compare the licensed level of care with the provider's recommendation. A licensed addiction counselor's credential does not replace the program license when one is required. Use the official directory and state licensing information rather than relying only on the provider's website.",
      },
      {
        heading: "Paying for treatment",
        body: "North Dakota Medicaid covers eligible substance use disorder treatment through enrolled programs and licensed rendering professionals, subject to provider policy, clinical need, and authorization. The state publishes specific Medicaid guidance for substance use disorder treatment and housing providers. North Dakota's Substance Use Disorder Voucher can also reduce access barriers for qualifying people and works with approved providers, but it does not replace Medicaid when a person is eligible. Ask the program and Medicaid to confirm the exact service and billing entity. Private insurance members should verify facility, professional, medication, laboratory, transportation, and housing charges separately.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the North Dakota treatment program license and verify the address and level of care in the state directory. Confirm Medicaid enrollment, private insurance network status, or eligibility for the Substance Use Disorder Voucher before treatment. Ask who obtains authorization and whether room, board, transportation, or recovery housing is billed separately. Find out which medications for opioid or alcohol use disorder are available and whether current prescriptions continue. Ask what licensed professionals supervise care, how medical emergencies are handled, and who will coordinate follow-up medication, counseling, and recovery support after discharge.",
      },
    ],
  },
  oklahoma: {
    intro: "Oklahoma requires state certification for alcohol and drug treatment programs, with additional accreditation requirements for some residential Medicaid providers. SoonerCare enrollment is separate. Confirm each credential and the exact service before admission.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Oklahoma Department of Mental Health and Substance Abuse Services, or ODMHSAS, certifies alcohol and drug treatment organizations under Title 43A. Certification covers outpatient and residential treatment program types. Residential providers seeking SoonerCare reimbursement must also meet applicable national accreditation requirements, and new residential providers can need a certificate of need for reimbursement. Opioid treatment programs require state certification plus federal certification, national accreditation, and controlled substance registration. Ask for the ODMHSAS certification tied to the exact location and service, then verify it through the state's certified-provider information. Individual professional licenses do not replace program certification.",
      },
      {
        heading: "Paying for treatment",
        body: "Oklahoma Medicaid is called SoonerCare and is administered by the Oklahoma Health Care Authority. Covered outpatient, inpatient, residential, and medication services depend on eligibility, provider enrollment, certification, medical necessity, and prior authorization. Inpatient hospital and residential services require authorization under SoonerCare policy. A certified program is not automatically enrolled for every service. Call SoonerCare with the legal billing name, address, and recommended level of care. ODMHSAS also contracts for publicly funded treatment that may help qualifying people without adequate insurance. Private insurance members should confirm all billing entities and nonclinical charges separately.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the ODMHSAS certification and verify the approved program type and address. For residential care, ask which national accreditation is current and whether the program has the approvals required for SoonerCare reimbursement. Confirm SoonerCare enrollment or private insurance network status, and ask who obtains authorization. Find out which medications for opioid or alcohol use disorder are offered and whether an existing prescription will continue. Ask what medical staff are present, how emergencies are transferred, and how co-occurring conditions are treated. Request written costs and a discharge plan naming the next prescriber, counselor, and recovery support provider.",
      },
    ],
  },
  oregon: {
    intro: "Oregon certifies substance use disorder programs through the state health authority and delivers Medicaid through the Oregon Health Plan, usually through coordinated care organizations. Verify program certification, service level, and plan participation before choosing care.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Oregon Health Authority certifies substance use disorder treatment programs under Oregon Administrative Rules, including OAR Chapters 309 and 415. Providers seeking reimbursement for covered program services generally must hold the applicable Certificate of Approval or facility authority for outpatient, residential, withdrawal management, or other approved services. Ask for the certificate tied to the exact address and compare the approved service with what is being recommended. A clinician's professional license, referral listing, or national accreditation does not replace program certification when Oregon rules require it. Residential and withdrawal settings can also have facility-specific requirements, so verify the site rather than only the parent organization.",
      },
      {
        heading: "Paying for treatment",
        body: "Oregon Medicaid is called the Oregon Health Plan, or OHP. It covers behavioral health and substance use disorder care through enrolled providers, commonly coordinated by a local coordinated care organization. OHP states that members can seek behavioral health services without a primary care referral, but network, clinical, and authorization rules can still apply to specific levels of care. Call the coordinated care organization with the provider's legal name, address, and proposed service. Uninsured residents can ask local community behavioral health programs about publicly funded options. Private insurance members should verify facility, clinician, medication, laboratory, transportation, and housing charges separately.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the Oregon Certificate of Approval or other program and facility approval that covers the location and service. Confirm OHP enrollment and participation in your coordinated care organization, or private insurance network status. Ask who completes the assessment, who obtains authorization, and what happens if the payer approves a lower level or shorter duration. Find out which medications for opioid or alcohol use disorder are offered and whether current prescriptions continue. For residential or withdrawal services, ask what medical staff are present and how emergencies are handled. Request written costs and a continuing-care plan before admission.",
      },
    ],
  },
  "rhode-island": {
    intro: "Rhode Island licenses behavioral health organizations, including programs that provide substance use disorder services, through a statewide regulatory system. Medicaid enrollment and payment rules are separate. Confirm the license, approved service, and coverage before admission.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Rhode Island Department of Behavioral Healthcare, Developmental Disabilities and Hospitals, or BHDDH, licenses behavioral healthcare organizations under 212-RICR-10-10-1. The rules apply to covered facilities, programs, and organizations providing substance use disorder services to adults or children. Ask for the BHDDH license tied to the exact address and confirm that the proposed outpatient, residential, medication, or other service is approved. Opioid treatment programs also must meet federal certification and controlled substance requirements. An individual professional license or national accreditation does not replace the organization license when Rhode Island law requires it. Use state licensing resources to verify the current status.",
      },
      {
        heading: "Paying for treatment",
        body: "Rhode Island Medicaid is administered by the Executive Office of Health and Human Services. Covered substance use disorder services include qualifying outpatient and residential care through enrolled providers, with payment rules based on the service, provider type, member arrangement, and authorization. Rhode Island publishes specific billing guidance for residential levels of care. A BHDDH license does not guarantee Medicaid enrollment or managed care network status. Call the plan or Medicaid with the provider's legal name and location. Publicly funded behavioral health programs may help uninsured residents. Private insurance members should verify facility, professional, medication, laboratory, and housing charges separately.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the BHDDH license and verify the location, program type, and approved services. Confirm Rhode Island Medicaid enrollment and managed care participation, or private insurance network status, before admission. Ask who obtains authorization and which clinical or housing charges may be billed separately. Find out whether medications for opioid or alcohol use disorder are available, whether existing prescriptions continue, and what medical support is present. Ask how co-occurring mental health needs and emergencies are handled. Request a written estimate and a discharge plan naming the provider responsible for continuing medication, counseling, and recovery support.",
      },
    ],
  },
  "south-carolina": {
    intro: "South Carolina licenses facilities that treat people with alcohol or other substance use disorders through the Department of Public Health. Medicaid enrollment is handled separately. Verify the facility category, address, approved service, and insurance arrangement before choosing care.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The South Carolina Department of Public Health licenses facilities for chemically dependent or addicted persons under Regulation 60-93 and state health facility law. Licensed modalities include outpatient treatment, residential treatment, medical detoxification, social detoxification, and narcotic treatment. Ask for the license tied to the exact address and verify the approved modality in the state's facility information. An organization can operate more than one site with different approvals. Individual counselor credentials and national accreditation do not replace a required facility license. Opioid or narcotic treatment programs also have federal certification and controlled substance requirements in addition to state licensure.",
      },
      {
        heading: "Paying for treatment",
        body: "South Carolina Medicaid covers eligible behavioral health and substance use disorder services through enrolled providers and managed care arrangements. Providers must meet the applicable licensure or certification requirements and complete Medicaid enrollment, but a state facility license alone does not establish network status. Call the member's plan with the provider's legal name, address, and recommended service. The state alcohol and drug services system also supports county and community treatment resources that may help people without adequate insurance. Private insurance members should verify facility, professional, medication, laboratory, transportation, and housing charges separately and request written authorization when required.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the South Carolina facility license and confirm the approved modality at the exact location. Verify Medicaid enrollment and managed care participation, or private insurance network status, with the payer. Ask who completes the assessment, which criteria support the level of care, and who obtains authorization. Find out whether medications for opioid or alcohol use disorder are available and whether a current prescription will continue. For residential or detoxification care, ask what medical staff are present and which hospital handles transfers. Request written costs and the name of the provider who will continue medication, counseling, and recovery support after discharge.",
      },
    ],
  },
  "south-dakota": {
    intro: "South Dakota accredits substance use disorder treatment programs through its Office of Licensing and Accreditation. Medicaid provider enrollment is separate. Confirm the approved levels of care, payer participation, and continuing-care plan before starting treatment.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The South Dakota Department of Social Services, Office of Licensing and Accreditation, accredits behavioral health providers that offer substance use disorder treatment and prevention. Programs can be accredited for specific levels such as early intervention, outpatient, intensive outpatient, day treatment, low-intensity residential treatment, residential detoxification, and medically monitored residential treatment. Ask for the accreditation record tied to the exact location and proposed level of care. South Dakota publishes provider and accreditation information. Individual professional credentials or a national accreditation do not automatically show that the state has approved every service, although state rules allow deemed accreditation in qualifying circumstances.",
      },
      {
        heading: "Paying for treatment",
        body: "South Dakota Medicaid covers eligible substance use disorder agency services through enrolled providers. The agency must be accredited by the state Office of Licensing and Accreditation or meet an approved deemed-status path. Current Medicaid policy includes service and provider requirements, and some residential care requires authorization or has benefit limits. Call South Dakota Medicaid with the provider's legal name, address, and level of care. State-contracted providers can offer financial assistance for qualifying people without adequate coverage. Private insurance members should verify the facility, clinicians, medications, laboratory work, transportation, and any room or board charges separately.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the South Dakota accreditation record and verify every approved level of care at the location. Confirm Medicaid enrollment or private insurance network status, and ask who obtains authorization. Ask whether the program uses state accreditation or deemed status and which evidence supports it. Find out which medications for opioid or alcohol use disorder are available, whether current prescriptions continue, and what medical staff are present during residential or withdrawal care. Ask how emergencies are transferred and whether financial assistance is available. Request written costs and a discharge plan naming the next prescriber, counselor, and recovery support provider.",
      },
    ],
  },
  tennessee: {
    intro: "Tennessee licenses alcohol and drug treatment facilities through its behavioral health department, with different categories for outpatient, detoxification, residential, and opioid treatment. TennCare participation is separate. Verify the exact license and payer before admission.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Tennessee Department of Mental Health and Substance Abuse Services, Office of Licensure, licenses alcohol and drug treatment facilities. Categories include nonresidential rehabilitation, outpatient detoxification, residential detoxification, residential rehabilitation, halfway house treatment, youth residential treatment, and opioid treatment. The office conducts inspections, investigates complaints, and maintains licensed facility records. Ask for the license tied to the exact address and confirm that its category matches the recommended service. A professional license, recovery residence listing, or national accreditation does not replace the facility license when Tennessee rules require one. Opioid treatment programs also must meet federal certification requirements.",
      },
      {
        heading: "Paying for treatment",
        body: "Tennessee Medicaid is called TennCare and delivers behavioral health benefits through managed care organizations. Covered substance use disorder services depend on eligibility, provider enrollment, network status, medical necessity, and authorization. A Tennessee facility license does not guarantee that the provider participates in every TennCare plan. Call the plan with the legal billing name, address, and proposed level of care. State-contracted providers may have grant-funded services for people without adequate coverage. Private insurance members should verify facility, professional, medication, laboratory, transportation, and housing costs separately and ask whether any service is billed by another organization.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the Tennessee facility license and verify the category and address in the state records. Confirm TennCare enrollment and participation in your managed care plan, or private insurance network status. Ask who obtains authorization and what happens if fewer days are approved. Find out which medications for opioid or alcohol use disorder are available and whether a current prescription will continue. For residential or detoxification care, ask what clinical and medical staff are present and how emergencies are transferred. Request written costs and a continuing-care plan that names the provider responsible for medication, counseling, and recovery support after discharge.",
      },
    ],
  },
  utah: {
    intro: "Utah licenses many substance use treatment programs as human services programs and routes Medicaid behavioral health benefits through county, prepaid, or integrated managed care arrangements. Confirm the program license, service scope, and plan before admission.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Utah Department of Health and Human Services, Office of Licensing, licenses covered human services programs, including substance use disorder treatment settings, under state administrative rules. Requirements depend on whether the service is outpatient, residential, recovery residence, youth, or another program type. Ask the provider for the license tied to the exact location and confirm which services it authorizes. Utah's local substance use authorities also contract with providers, but a county contract or referral does not replace a required program license. Individual clinician licenses and national accreditation should be verified separately. Opioid treatment programs also need federal certification and controlled substance approval.",
      },
      {
        heading: "Paying for treatment",
        body: "Utah Medicaid covers behavioral health and substance use disorder services, including therapy, detoxification, opioid use disorder treatment, and qualifying residential care. Delivery varies by county and member arrangement. Some members receive services through Prepaid Mental Health Plans, while integrated plans manage physical and behavioral benefits in designated counties. Call the plan or local authority with the provider's legal name, address, and recommended service. Provider licensure does not guarantee network participation. People without adequate coverage can ask the local substance use authority about public funding. Private insurance members should verify facility, clinician, medication, laboratory, and housing charges separately.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the Utah program license and verify the service and address. Confirm whether your Medicaid benefit is handled by a Prepaid Mental Health Plan, integrated plan, fee-for-service network, or local authority, then verify the provider with that organization. Ask who obtains authorization and which charges are not covered. Find out whether medication treatment is available on site and whether existing prescriptions continue. For residential or detoxification services, ask what medical staff are present and how emergencies are handled. Request written costs and a discharge plan identifying the next prescriber, counselor, and recovery support provider.",
      },
    ],
  },
  vermont: {
    intro: "Vermont certifies state-funded substance use treatment providers through the Department of Health and uses Medicaid enrollment for payment. Private and public programs can follow different paths, so ask which certification, professional license, and payer rules apply to the exact service.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Vermont Department of Health, Division of Substance Use Programs, certifies approved and preferred substance use disorder treatment providers under the state's Treatment Certification Rule. A preferred provider holds a department certificate and a state contract or grant, and certified programs are reviewed for compliance with treatment standards. Certification is required for programs that receive applicable state or federal funding from the department. Private practitioners and other organizations can operate under professional or facility licensing rules outside the preferred-provider system. Ask the program to identify its Department of Health certification, facility authority, and professional licenses, then verify the path that applies. Do not assume that preferred-provider status covers every site or service.",
      },
      {
        heading: "Paying for treatment",
        body: "Vermont Medicaid is administered by the Department of Vermont Health Access. Eligible members can receive covered substance use disorder treatment through enrolled providers, including qualified licensed alcohol and drug counselors and organized treatment programs. Vermont also uses a Hub and Spoke system for opioid use disorder treatment. Coverage depends on member eligibility, provider enrollment, service requirements, and authorization. A Department of Health certificate does not automatically prove that every service is enrolled for Medicaid payment. Uninsured residents can ask preferred providers about state-funded access. Private insurance members should verify facility, professional, medication, laboratory, transportation, and housing charges separately.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask whether the organization is a Vermont certified preferred provider and verify the location and service with the Department of Health. If it is not, ask which facility and professional licenses authorize the care. Confirm Vermont Medicaid enrollment or private insurance network status before admission. Ask who completes the assessment, who obtains authorization, and which charges are outside the clinical benefit. Find out whether medications for opioid or alcohol use disorder are available and how the program connects with the Hub and Spoke system when relevant. Request written costs and a discharge plan naming the next prescriber, counselor, and recovery support provider.",
      },
    ],
  },
  virginia: {
    intro: "Virginia licenses substance use disorder treatment programs through its behavioral health department and pays Medicaid addiction services through Cardinal Care. The license, service credential, and managed care contract are separate checks. Verify all that apply before admission.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Virginia Department of Behavioral Health and Developmental Services, or DBHDS, licenses providers of substance use disorder services under state regulations. Licenses identify approved services and levels of care, including outpatient, intensive outpatient, partial hospitalization, residential, withdrawal management, and opioid treatment. Ask for the DBHDS license tied to the exact address and recommended service. Virginia's Addiction and Recovery Treatment Services program also uses service-specific credentialing for Medicaid. A professional license or national accreditation does not replace the program license when one is required. Opioid treatment programs must also meet federal certification and controlled substance rules. Verify the site rather than only the parent company.",
      },
      {
        heading: "Paying for treatment",
        body: "Virginia Medicaid operates under Cardinal Care, with most members receiving services through Cardinal Care Managed Care. Addiction and Recovery Treatment Services cover eligible levels of substance use care through qualified, enrolled, and credentialed providers. A DBHDS license does not guarantee that the provider is contracted with every Cardinal Care plan. Call the plan with the legal billing name, address, and service. State and community providers may have public funding for people without adequate insurance. Private insurance members should verify the facility, professionals, medications, laboratory work, transportation, and any recovery housing charges separately.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the DBHDS license and verify the approved service and address. Confirm the provider's Addiction and Recovery Treatment Services credential and contract with your Cardinal Care plan, or private insurance network status. Ask who performs the assessment, which level-of-care criteria are used, and who obtains authorization. Find out which medications for opioid or alcohol use disorder are available and whether a current prescription will continue. For residential or withdrawal care, ask what medical staff are present and how emergencies are transferred. Request written costs and a continuing-care plan that identifies the next prescriber, counselor, and recovery support provider.",
      },
    ],
  },
  "west-virginia": {
    intro: "West Virginia requires behavioral health centers to hold a state health facility license and separately enroll for Medicaid payment. Verify the center's license, the exact service, and the member's coverage before choosing treatment.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The West Virginia Office of Health Facility Licensure and Certification licenses behavioral health centers under state law. A center may not provide behavioral health services without the required license, and the office can inspect, investigate, suspend, or revoke licenses. Substance use disorder services can also be subject to program-specific standards depending on the setting, such as residential treatment or opioid treatment. Ask for the license tied to the exact address and confirm that it covers the recommended service. Individual clinician licenses and national accreditation do not replace the center license when it is required. Opioid treatment programs also need federal certification and controlled substance registration.",
      },
      {
        heading: "Paying for treatment",
        body: "West Virginia Medicaid covers eligible behavioral health and substance use disorder services through enrolled providers and managed care arrangements. Licensed behavioral health centers can participate when they meet Medicaid provider requirements, but licensure alone does not establish network status or authorization. Call the member's plan with the legal billing name, address, and proposed service. The state behavioral health system also funds community programs that may help qualifying people who are uninsured. Private insurance members should verify facility, professional, medication, laboratory, transportation, and housing charges separately. Ask whether each service is billed by the center or another medical group.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the West Virginia behavioral health center license and verify the address and approved services. Confirm Medicaid enrollment and managed care participation, or private insurance network status, before admission. Ask who obtains authorization and what happens if the payer approves less care than recommended. Find out whether medication treatment is available on site, whether existing prescriptions continue, and what clinical or medical staff are present after hours. Ask how emergencies and co-occurring mental health needs are handled. Request a written estimate and a discharge plan naming the provider responsible for continuing medication, counseling, and recovery support.",
      },
    ],
  },
  wisconsin: {
    intro: "Wisconsin certifies substance use treatment services by service type under DHS 75. BadgerCare Plus and Medicaid payment require additional enrollment and coverage checks. Confirm the program's certificate, approved level of care, and payer participation before admission.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Wisconsin Department of Health Services, Division of Quality Assurance, certifies substance use treatment programs under Wisconsin Administrative Code Chapter DHS 75. Separate service standards cover outpatient treatment, integrated behavioral health, intensive outpatient, day treatment or partial hospitalization, residential treatment, withdrawal management, opioid treatment, and office-based opioid treatment. Ask for the certificate tied to the exact location and service. Wisconsin requires consistently used branch locations to be listed, while residential and inpatient services have location-specific requirements. A professional license or national accreditation does not replace program certification when DHS 75 requires it. Verify the current certificate through state resources.",
      },
      {
        heading: "Paying for treatment",
        body: "Wisconsin Medicaid and BadgerCare Plus cover eligible substance use disorder treatment through enrolled and appropriately certified providers. Coverage can include outpatient and qualifying residential services, subject to member eligibility, service policy, provider enrollment, managed care network, and authorization. A DHS 75 certificate does not guarantee participation in every health plan. Call the plan with the provider's legal name, address, and level of care. County behavioral health programs may help people without adequate insurance access publicly funded services. Private insurance members should verify facility, professional, medication, laboratory, transportation, and housing charges separately.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the DHS 75 certificate and verify the approved service and location. Confirm Medicaid or BadgerCare Plus enrollment and managed care participation, or private insurance network status. Ask who completes the assessment, who obtains authorization, and what happens if the payer approves fewer days. Find out which medications for opioid or alcohol use disorder are available and whether current prescriptions continue. For residential or withdrawal care, ask what medical staff are present and how emergencies are handled. Request written costs, including any room and board amount, and a discharge plan identifying the next prescriber, counselor, and recovery support provider.",
      },
    ],
  },
  wyoming: {
    intro: "Wyoming certifies substance use disorder providers for court-referred services, state funding, and designated community programs. Medicaid enrollment is separate. Confirm the provider's certification, professional licenses, exact service, and payment route before treatment.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "The Wyoming Department of Health, Behavioral Health Division, administers the state Substance Use Disorder Services provider certification program. State certification is required for programs that provide court-ordered or referred assessments, receive state substance use treatment funds, or operate designated community mental health center services. Certification requirements can include national accreditation for funded or residential providers, while individual clinicians must hold the appropriate professional licenses. Ask for the state certification tied to the exact location and service and verify it in Wyoming's certified-provider search. Private programs outside those categories may rely on professional and facility rules, so ask the provider to identify the authority that applies rather than assuming every program has the same certificate.",
      },
      {
        heading: "Paying for treatment",
        body: "Wyoming Medicaid covers eligible behavioral health and substance use treatment services through certified centers, substance abuse treatment centers, and specified licensed providers under state Medicaid rules. Provider certification and Medicaid enrollment are separate steps, and coverage depends on eligibility, service requirements, medical necessity, and authorization. Call Wyoming Medicaid with the provider's legal name, address, and recommended service. Behavioral Health Division contracts can support qualifying community services for people without adequate insurance. Private insurance members should verify facility, professional, medication, laboratory, transportation, and housing charges separately and ask whether any service is billed by another organization.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask whether Wyoming certification is required for the service and request the current certificate if it is. Verify the exact location, approved services, national accreditation, and supervising professional licenses. Confirm Wyoming Medicaid enrollment or private insurance network status before admission. Ask who obtains authorization and which charges are not covered. Find out whether medications for opioid or alcohol use disorder are available and whether current prescriptions continue. For residential or withdrawal care, ask what medical staff are present and how emergencies are transferred. Request written costs and a continuing-care plan that identifies the next prescriber, counselor, and recovery support provider.",
      },
    ],
  },
  "district-of-columbia": {
    intro: "The District of Columbia is not a state, and its treatment system is run locally rather than through a state agency. That makes the exact licensing authority and payment rules different from neighboring Maryland and Virginia, so verify each detail for the specific address before choosing a program.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "Addiction treatment providers in the District are licensed and overseen locally. Ask the provider which District agency licenses its program and level of care, and verify the license directly with that agency before admission. A professional license held by a clinician, or accreditation from a national body, does not replace the program license when one is required. Opioid treatment programs must also meet federal certification and controlled substance rules. Verify the license for the exact address and service rather than only the parent organization.",
      },
      {
        heading: "Paying for treatment",
        body: "Medicaid in the District covers eligible substance use disorder services, but covered services, authorization rules, and participating providers depend on the enrollee's plan. Call the plan with the provider's legal name, address, and recommended service to confirm network status and authorization before admission. Private insurance must cover addiction treatment comparably to other medical care under federal parity rules, but network status still varies by plan and service. Ask for a written estimate and confirm what is billed separately, including medications, laboratory work, and transportation.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the program's license number and the District agency that issued it, and verify both before visiting. Ask which levels of care are provided on site versus referred elsewhere. Confirm whether the program bills Medicaid or your private insurer directly, and whether prior authorization is required. Ask which medications for opioid or alcohol use disorder are available on site. Ask what a typical day looks like, who is present after hours, and what aftercare is arranged after discharge.",
      },
    ],
  },
  "puerto-rico": {
    intro: "Puerto Rico operates its own health and behavioral health system, and licensing and payment rules differ from the states. Many providers serve people in Spanish, so ask about language, licensing, and coverage for the specific program before choosing one.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "Addiction treatment providers in Puerto Rico are licensed under local rules, and the responsible agency and license type can vary by program and setting. Ask the provider which agency licenses it for the recommended level of care, and verify the license with that agency. A clinician license or national accreditation does not replace the program license when one is required. Opioid treatment programs must also meet federal certification and controlled substance rules. Verify the license for the exact address and service.",
      },
      {
        heading: "Paying for treatment",
        body: "Medicaid in Puerto Rico operates under local rules that differ from the states, so covered services and participating providers vary. Call the plan with the provider's legal name, address, and recommended service to confirm coverage and authorization before admission. Private insurance must cover addiction treatment comparably to other medical care under federal parity rules, but network status still varies by plan and service. Ask for a written estimate and confirm what is billed separately, including medications, laboratory work, and transportation.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the program's license number and the agency that issued it, and verify both. Ask which levels of care are provided on site and whether services are offered in Spanish, English, or both. Confirm insurance network status and authorization in writing before admission. Ask which medications for opioid or alcohol use disorder are available on site. Ask what happens after discharge, including aftercare, recovery support, and help finding care if you travel.",
      },
    ],
  },
  guam: {
    intro: "Guam is a U.S. territory with its own local health system, and the number of treatment providers on the island is small. Start by checking which levels of care are available locally, and ask what happens when a recommended level of care is not offered on Guam.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "Addiction treatment providers on Guam are regulated locally, and licensing requirements vary by program and setting. Ask the provider which local agency licenses it for the recommended level of care, and verify the license with that agency. A clinician license or national accreditation does not replace the program license when one is required. Opioid treatment programs must also meet federal certification and controlled substance rules. Verify the license for the exact address and service.",
      },
      {
        heading: "Paying for treatment",
        body: "Medicaid on Guam operates under territorial rules that differ from the states, so covered services and participating providers vary. Call the plan with the provider's legal name, address, and recommended service to confirm coverage and authorization before admission. Private insurance must cover addiction treatment comparably to other medical care under federal parity rules, but network status still varies by plan and service. Ask for a written estimate and confirm what is billed separately, including medications, laboratory work, and transportation.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the program's license number and the agency that issued it, and verify both. Ask which levels of care are provided on site and what happens when a service is not available on the island. Confirm insurance coverage and authorization in writing before admission. Ask which medications for opioid or alcohol use disorder are available on site. Ask how aftercare works when follow-up care must be arranged off island.",
      },
    ],
  },
  "american-samoa": {
    intro: "American Samoa is a U.S. territory with its own local health system, and treatment options in the territory are limited. Start by checking which services are available locally, and ask how the provider helps arrange care elsewhere when a recommended level of care is not offered in the territory.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "Addiction treatment providers in American Samoa are regulated locally, and licensing requirements vary by program and setting. Ask the provider which local agency licenses it for the recommended level of care, and verify the license with that agency. A clinician license or national accreditation does not replace the program license when one is required. Opioid treatment programs must also meet federal certification and controlled substance rules. Verify the license for the exact address and service.",
      },
      {
        heading: "Paying for treatment",
        body: "Medicaid in American Samoa operates under territorial rules that differ from the states, so covered services and participating providers vary. Call the plan with the provider's legal name, address, and recommended service to confirm coverage and authorization before admission. Private insurance must cover addiction treatment comparably to other medical care under federal parity rules, but network status still varies by plan and service. Ask for a written estimate and confirm what is billed separately, including medications, laboratory work, and transportation.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the program's license number and the agency that issued it, and verify both. Ask which services are provided locally and how the provider helps arrange care elsewhere when a level of care is not available in the territory. Confirm insurance coverage and authorization in writing before admission. Ask which medications for opioid or alcohol use disorder are available on site. Ask how aftercare works when follow-up care must be arranged off island.",
      },
    ],
  },
  "northern-mariana-islands": {
    intro: "The Northern Mariana Islands are a U.S. territory with their own local health system, and treatment options in the territory are limited. Start by checking which services are available locally, and ask how the provider helps arrange care elsewhere when a recommended level of care is not offered in the territory.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "Addiction treatment providers in the Northern Mariana Islands are regulated locally, and licensing requirements vary by program and setting. Ask the provider which local agency licenses it for the recommended level of care, and verify the license with that agency. A clinician license or national accreditation does not replace the program license when one is required. Opioid treatment programs must also meet federal certification and controlled substance rules. Verify the license for the exact address and service.",
      },
      {
        heading: "Paying for treatment",
        body: "Medicaid in the Northern Mariana Islands operates under territorial rules that differ from the states, so covered services and participating providers vary. Call the plan with the provider's legal name, address, and recommended service to confirm coverage and authorization before admission. Private insurance must cover addiction treatment comparably to other medical care under federal parity rules, but network status still varies by plan and service. Ask for a written estimate and confirm what is billed separately, including medications, laboratory work, and transportation.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the program's license number and the agency that issued it, and verify both. Ask which services are provided locally and how the provider helps arrange care elsewhere when a level of care is not available in the territory. Confirm insurance coverage and authorization in writing before admission. Ask which medications for opioid or alcohol use disorder are available on site. Ask how aftercare works when follow-up care must be arranged off island.",
      },
    ],
  },
  "u-s-virgin-islands": {
    intro: "The U.S. Virgin Islands are a U.S. territory with their own local health system, and treatment options in the territory are limited. Start by checking which services are available locally, and ask how the provider helps arrange care elsewhere when a recommended level of care is not offered in the territory.",
    sections: [
      {
        heading: "Licensing and oversight",
        body: "Addiction treatment providers in the U.S. Virgin Islands are regulated locally, and licensing requirements vary by program and setting. Ask the provider which local agency licenses it for the recommended level of care, and verify the license with that agency. A clinician license or national accreditation does not replace the program license when one is required. Opioid treatment programs must also meet federal certification and controlled substance rules. Verify the license for the exact address and service.",
      },
      {
        heading: "Paying for treatment",
        body: "Medicaid in the U.S. Virgin Islands operates under territorial rules that differ from the states, so covered services and participating providers vary. Call the plan with the provider's legal name, address, and recommended service to confirm coverage and authorization before admission. Private insurance must cover addiction treatment comparably to other medical care under federal parity rules, but network status still varies by plan and service. Ask for a written estimate and confirm what is billed separately, including medications, laboratory work, and transportation.",
      },
      {
        heading: "Questions to ask providers",
        body: "Ask for the program's license number and the agency that issued it, and verify both. Ask which services are provided locally and how the provider helps arrange care elsewhere when a level of care is not available in the territory. Confirm insurance coverage and authorization in writing before admission. Ask which medications for opioid or alcohol use disorder are available on site. Ask how aftercare works when follow-up care must be arranged off island.",
      },
    ],
  },
};

// SOURCES
// California:
// - DHCS directories of licensed/certified SUD facilities: https://www.dhcs.ca.gov/providers-partners/directories-for-substance-use-disorder-services/
// - DHCS SUD Licensing and Certification Toolkit (licensing vs certification, LOC designation): http://dhcs.ca.gov/provgovpart/Documents/SUD-Toolkit.pdf
// - NBHAP California state laws (DHCS licensing requirements): https://nbhap.org/state-laws-california/
// - Drug Medi-Cal coverage, county access lines, no copay: https://www.drugaddictionnow.com/iehp-murrieta-guide-to-mental-health-and-sud-care/
// Texas:
// - HHSC Chemical Dependency Treatment Facilities (licensing, verification): https://hhs.texas.gov/providers/health-care-facilities-regulation/chemical-dependency-treatment-facilities
// - STAR Health SUD benefits (assessment, residential, MAT): https://www.hhs.texas.gov/sites/default/files/documents/amended-star-health-8.pdf
// - Texas Medicaid non-expansion status: https://www.healthinsurance.org/medicaid/texas/
// Florida:
// - DCF substance abuse treatment and licensing: https://prod.myflfamilies.com/services/samh/treatment
// - DCF licensing under Ch. 397 / HB 807 background: https://lifeskillsbehavioralhealth.com/blog/what-is-house-bill-807-and-why-is-it-a-welcomed-reform-for-florida-substance-use-providers/
// - SMMC covered services incl. substance abuse treatment: https://flahca.ccplatform.net/content/download/27219/file/SMMC_Highlight_ILOS_Chart_08062025.pdf
// - Non-expansion states list (incl. Florida): https://www.stedi.com/blog/how-the-one-big-beautiful-bill-impacts-medicaid-eligibility-checks
// New York:
// - OASAS program certification: https://oasas.ny.gov/providers/program-certification
// - OASAS Provider and Program Search: https://webapps.oasas.ny.gov/providerDirectory/index.cfm
// - NY Medicaid behavioral health managed care: https://www.health.ny.gov/health_care/medicaid/redesign/behavioral_health/
// - Medicaid SUD continuum and covered services: https://www.health.ny.gov/health_care/medicaid/redesign/med_waiver_1115/docs/sud_implement_plan.pdf
// Pennsylvania:
// - DDAP treatment and licensed-facility search: https://www.pa.gov/services/ddap/locate-drug-and-alcohol-treatment-services
// - Pennsylvania Drug and Alcohol Facility Locator: https://sais.health.pa.gov/CommonPOC/Content/PublicWeb/DAFind.aspx
// - DDAP licensing overview: https://www.pa.gov/agencies/ddap
// Ohio:
// - Behavioral health license and certificate types: https://dbh.ohio.gov/supporting-providers/licensure-and-certification/types-of-licenses-and-certificates/
// - Ohio Medicaid behavioral health services: https://medicaid.ohio.gov/resources-for-providers/bh/providers
// Illinois:
// - Illinois SUD license application and Part 2060 requirements: https://www.dhs.state.il.us/onenetlibrary/12/documents/Forms/629617-202605-A11Y_REV2_RE.pdf
// - Illinois Medicaid community behavioral health services: https://hfs.illinois.gov/medicalclients/behavioral/medicaidcommunitybehavioralhealthservices.html
// Washington:
// - Washington Behavioral Health Agency licensing: https://doh.wa.gov/licenses-permits-and-certificates/facilities-z/behavioral-health-agencies-bha
// - Apple Health substance use treatment: https://www.hca.wa.gov/billers-providers-partners/program-information-providers/substance-use-treatment
// - Apple Health managed care: https://www.hca.wa.gov/free-or-low-cost-health-care/i-need-medical-dental-or-vision-care/apple-health-managed-care
// Arizona:
// - Arizona public health licensing and facility databases: https://www.azdhs.gov/licensing/
// - AZ Care Check: https://azcarecheck.azdhs.gov/s/
// - AHCCCS provider directory: https://www.azahcccs.gov/Members/ProgramsAndCoveredServices/ProviderListings/
// North Carolina:
// - DHSR substance use service licensure: https://info.ncdhhs.gov/dhsr/mhlcs/establish.html
// - NC Medicaid behavioral health services: https://medicaid.ncdhhs.gov/providers/programs-and-services/behavioral-health-idd/behavioral-health-and-intellectual-developmental-disabilities-services
// - 2026 NC Medicaid SUD coverage updates: https://medicaid.ncdhhs.gov/blog/2026/01/07/behavioral-health-clinical-coverage-policy-updates
// Georgia:
// - DBHDD licensing authority effective in 2026: https://dbhdd.georgia.gov/be-connected/background-policy-gaps-information
// - Georgia DATEP rules: https://rules.sos.ga.gov/gac/82-10-1
// - Georgia Medicaid behavioral health services: https://medicaid.georgia.gov/types-services/behavioral-health-services
// Michigan:
// - LARA substance use disorder program licensing: https://www.michigan.gov/lara/bureau-list/bchs/non-long-term-care
// - Michigan licensed-provider directories: https://www.michigan.gov/lara/bureau-list/bchs/directory
// - Michigan Medicaid SUD Health Home: https://www.michigan.gov/mdhhs/assistance-programs/medicaid/substance-use-disorder-health-home/persons-served
// New Jersey:
// - NJSAMS licensed-treatment directory: https://www.nj.gov/humanservices/dmhas/help/substance/
// - ReachNJ Medicaid and treatment directory resources: https://www.nj.gov/humanservices/reachnj/resources/
// - NJ FamilyCare coverage: https://www.nj.gov/humanservices/dmahs/individuals-families/familycare/
// - NJ Department of Health facility licensing: https://nj.gov/health/healthfacilities/certificate-need/
// Alabama:
// - ADMH certification standards and process: https://mh.alabama.gov/division-of-mental-health-substance-abuse-services/certification/
// - Alabama Medicaid substance use disorder demonstration: https://www.medicaid.alabama.gov/content/4.0_Programs/4.2_Medical_Services/4.2.6_Mental_Health/4.2.6.2_SMI_Waiver.aspx
// Alaska:
// - Alaska Division of Behavioral Health: https://health.alaska.gov/en/division-of-behavioral-health/
// - Alaska Medicaid behavioral health provider services: https://health.alaska.gov/en/education/information-for-providers/
// Arkansas:
// - Arkansas Part 433 treatment program licensure standards: https://codeofarrules.arkansas.gov/Rules/Rule?chapterID=128&levelType=part&partID=666&subChapterID=170&titleID=20
// - Arkansas Medicaid provider enrollment: https://humanservices.arkansas.gov/divisions-shared-services/medical-services/provider-enrollment/
// Colorado:
// - Colorado Behavioral Health Entity licensing statute: https://content.leg.colorado.gov/sites/default/files/images/olls/crs2024-title-27.pdf
// - Health First Colorado substance use disorder benefits: https://hcpf.colorado.gov/sud-benefits
// Connecticut:
// - Connecticut DPH facility licensing: https://portal.ct.gov/dph/facility-licensing--investigations/facility-licensing--investigations-section-flis/facility-licensing
// - Connecticut Medicaid substance use disorder demonstration: https://portal.ct.gov/dss/health-and-home-care/substance-use-disorder-demonstration-project/provider-resources
// Delaware:
// - Delaware substance use treatment licensing regulations: https://regulations.delaware.gov/api/register/june2015/0c5c62cb-b3e0-4368-98c2-6f6553f09289
// - Delaware publicly funded addiction treatment programs: https://dhss.delaware.gov/dsamh/division-of-substance-abuse-and-mental-health/publicly-funded-addiction-treatment-programs/
// Hawaii:
// - Hawaii ADAD treatment facility accreditation: https://health.hawaii.gov/substance-abuse/accreditation/
// - Hawaii Med-QUEST Division: https://medquest.hawaii.gov/
// Idaho:
// - Idaho behavioral health service providers: https://healthandwelfare.idaho.gov/providers/behavioral-health-providers/behavioral-health-service-providers
// - Idaho Medicaid residential substance use coverage: https://www.medicaid.gov/medicaid/spa/downloads/ID-24-0009.pdf
// Indiana:
// - Indiana DMHA addiction provider certification rules: https://secure.in.gov/fssa/dmha/for-providers/provider-information/certification-and-licensure-rules-and-indiana-code/
// - Indiana residential addiction treatment designation and Medicaid enrollment: https://secure.in.gov/fssa/dmha/addiction-services/for-addiction-providers/american-society-of-addiction-medicine-asam-designation
// Iowa:
// - Iowa HHS substance use disorder program licensure: https://hhs.iowa.gov/health-prevention/addiction-substance-use-disorders
// - Iowa Code Chapter 125 program license requirements: https://www.legis.iowa.gov/docs/code/2024/125.pdf
// Kansas:
// - KDADS behavioral health licensing: https://www.kdads.ks.gov/licensing-policy/behavioral-health-licensing
// - KanCare provider enrollment and managed care plans: https://www.kancare.ks.gov/providers
// Kentucky:
// - Kentucky Alcohol and Other Drug Entity licensure: https://www.chfs.ky.gov/agencies/dbhdid/Pages/dpi.aspx
// - Kentucky Medicaid behavioral health services: https://www.chfs.ky.gov/agencies/dms/dpo/bpb/Pages/behavioral-health.aspx
// Louisiana:
// - Louisiana Behavioral Health Service provider licensing: https://ldh.la.gov/page/behavioral-health-service-provider
// - Healthy Louisiana behavioral health resources: https://ldh.la.gov/page/behavioral-health
// Maine:
// - Maine behavioral health program licensing: https://www.maine.gov/dhhs/dlc/licensing-certification/behavioral-health
// - MaineCare substance use disorder care initiative: https://www.maine.gov/dhhs/oms/providers/provider-bulletins/notice-mainecare-1115-waiver-renewal-application-maine-substance-use-disorder-sud-care
// Maryland:
// - Maryland COMAR 10.63 behavioral health licensing rules: https://health.maryland.gov/regs/Pages/10-63-01-10-63-06-Behavioral-Health-Regulations-%28.aspx
// - Maryland Medicaid behavioral health provider information: https://health.maryland.gov/mmcp/Pages/Behavioral-Health-Services.aspx
// Massachusetts:
// - Massachusetts BSAS program licensure: https://www.mass.gov/info-details/information-for-initial-sud-program-licensure
// - MassHealth substance use disorder treatment regulations: https://www.mass.gov/doc/substance-use-disorder-treatment-services-regulations-1/download
// Minnesota:
// - Minnesota DHS substance use disorder treatment licensing: https://mn.gov/dhs/partners-and-providers/partners-licensing/substance-use-disorder-treatment/
// - Minnesota Statutes Chapter 245G: https://www.revisor.mn.gov/statutes/2024/cite/245G/full
// Mississippi:
// - Mississippi DMH provider certification: https://www.dmh.ms.gov/certification/
// - Mississippi Medicaid mental health provider resources: https://medicaid.ms.gov/providers/mental-health/
// Missouri:
// - Missouri DMH behavioral health certification: https://dmh.mo.gov/behavioral-health/certification
// - MO HealthNet CSTAR program: https://dss.mo.gov/mhd/cstar
// Montana:
// - Montana substance use disorder program state approval: https://dphhs.mt.gov/bhdd/SubstanceAbuse/ProviderForms
// - Montana behavioral health Medicaid provider resources: https://dphhs.mt.gov/bhdd/mentalhealthservices/ProviderResources
// Nebraska:
// - Nebraska Mental Health Substance Use Treatment Center licensing: https://dhhs.ne.gov/licensure/Pages/Mental-Health-Substance-Use-Treatment-Centers.aspx
// - Nebraska Medicaid Heritage Health: https://dhhs.ne.gov/Pages/Heritage-Health-Resources.aspx
// Nevada:
// - Nevada facility licensing rules for substance use treatment: https://www.leg.state.nv.us/Division/Legal/LawLibrary/NAC/NAC-449.html
// - Nevada Medicaid substance use treatment provider enrollment: https://medicaid.nv.gov/providers/enrollmentchecklists
// New Hampshire:
// - New Hampshire residential facility licensing law: https://gc.nh.gov/rsa/html/XI/151/151-2.htm
// - New Hampshire Medicaid substance use disorder provider rules: https://gc.nh.gov/rules/state_agencies/he-w500.html
// New Mexico:
// - New Mexico health facility licensing and certification: https://www.nmhealth.org/about/dhi/hflc/
// - New Mexico Medicaid Turquoise Care: https://www.hca.nm.gov/turquoise-care/
// North Dakota:
// - North Dakota licensed substance use disorder treatment directory: https://www.hhs.nd.gov/behavioral-health/substance-abuse-treatment-programs
// - North Dakota Medicaid substance use disorder policy: https://www.hhs.nd.gov/healthcare/medicaid/provider/manuals-and-guidelines
// Oklahoma:
// - ODMHSAS alcohol and drug treatment provider certification: https://oklahoma.gov/odmhsas/policy/provider-certification.html
// - SoonerCare behavioral health and substance use services: https://oklahoma.gov/ohca/providers/types/behavioral-health-and-substance-abuse-services.html
// Oregon:
// - Oregon Health Plan behavioral health coverage: https://www.oregon.gov/oha/HSD/OHP/Pages/Behavioral-Health.aspx
// - Oregon substance use disorder program certification and Medicaid policy: https://www.oregon.gov/oha/HSD/Medicaid-Policy/SUDWaiver/Evaluation-Design.pdf
// Rhode Island:
// - Rhode Island behavioral healthcare organization licensing rules: https://rules.sos.ri.gov/Regulations/part/212-10-10-01
// - Rhode Island Medicaid substance use residential billing: https://eohhs.ri.gov/providers-partners/provider-directories/substance-abuse-rehab
// South Carolina:
// - South Carolina licensed facilities for chemically dependent persons: https://dph.sc.gov/professionals/healthcare-quality/licensed-facilities-professionals/facilities-chemically-dependent
// - South Carolina Medicaid provider enrollment: https://www.scdhhs.gov/providers/become-provider
// South Dakota:
// - South Dakota behavioral health licensing and accreditation: https://olapublic.sd.gov/behavioral-health/
// - South Dakota Medicaid substance use disorder agency policy: https://dss.sd.gov/docs/medicaid/providers/billingmanuals/Professional/Substance_Use_Disorder.pdf
// Tennessee:
// - Tennessee alcohol and drug facility licensing: https://www.tn.gov/behavioral-health/licensing.html
// - TennCare provider resources: https://www.tn.gov/tenncare/providers.html
// Utah:
// - Utah human services program licensing: https://hslic.utah.gov/
// - Utah Medicaid managed behavioral health plans: https://medicaid.utah.gov/managed-care/
// Vermont:
// - Vermont substance use treatment provider certification: https://www.healthvermont.gov/alcohol-drugs/health-professionals/treatment-provider-certification
// - Vermont Medicaid participation for licensed alcohol and drug counselors: https://legislature.vermont.gov/statutes/section/26/062/03242
// Virginia:
// - Virginia Medicaid addiction treatment credentialing: https://www.dmas.virginia.gov/for-providers/benefits-services-for-providers/behavioral-health/addiction-and-recovery-treatment-services/arts-credentialing-and-resources-for-providers/
// - Virginia Cardinal Care managed care: https://www.dmas.virginia.gov/for-providers/cardinal-care-providers/cardinal-care-managed-care/
// West Virginia:
// - West Virginia behavioral health center licensing law: https://code.wvlegislature.gov/27-9-1/
// - West Virginia Medicaid licensed behavioral health centers: https://bms.wv.gov/licensed-behavioral-health-centers
// Wisconsin:
// - Wisconsin DHS 75 substance use treatment certification: https://www.dhs.wisconsin.gov/regulations/su/certification.htm
// - Wisconsin Medicaid residential substance use treatment: https://www.dhs.wisconsin.gov/library/collection/f-02766
// Wyoming:
// - Wyoming substance use disorder provider certification: https://health.wyo.gov/behavioralhealth/mhsa/certification/
// - Wyoming Medicaid behavioral health services rules: https://rules.wyo.gov/AjaxHandler.ashx?RULE_VERSION_ID=24889&handler=GetRuleVersionHTML
// District of Columbia and territories (general guidance only; no single
// regulator is named because licensing authority varies by jurisdiction):
// - SAMHSA FindTreatment.gov: https://findtreatment.gov/
