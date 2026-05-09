'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-8 bg-white p-8 md:p-12 rounded-3xl border border-border shadow-sm">
        
        <Link href="/login" className="text-sm text-primary font-medium hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <div className="space-y-4">
          <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: May 9, 2026</p>
        </div>

        <div className="space-y-6 text-sm text-foreground/80 leading-relaxed">
          <p className="font-medium text-foreground">
            IMPORTANT: PLEASE READ THESE TERMS OF SERVICE CAREFULLY. BY ACCESSING OR USING THE TIVARO BUSINESS OS PLATFORM, YOU AGREE TO BE BOUND BY THESE TERMS AND ALL TERMS INCORPORATED BY REFERENCE. IF YOU DO NOT AGREE TO ALL OF THESE TERMS, DO NOT USE OUR SERVICES.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">1. Acceptance of the Agreement</h2>
            <p>
              These Terms of Service (the "Agreement") constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you" or "User") and Tivaro ("we", "us", or "our"), concerning your access to and use of the Tivaro Business OS website and application, as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Service").
            </p>
            <p>
              We operate in the Philippines and make no representation that the Service is appropriate or available in other locations. Those who choose to access the Service from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">2. Eligibility and Authority</h2>
            <p>
              By using the Service, you represent and warrant that: (a) all registration information you submit will be true, accurate, current, and complete; (b) you will maintain the accuracy of such information and promptly update such registration information as necessary; (c) you have the legal capacity and you agree to comply with these Terms; (d) you are not a minor in the jurisdiction in which you reside; (e) you will not access the Service through automated or non-human means, whether through a bot, script or otherwise; (f) you will not use the Service for any illegal or unauthorized purpose; and (g) your use of the Service will not violate any applicable law or regulation.
            </p>
            <p>
              If you are using the Service on behalf of a company, entity, or organization, you represent and warrant that you are an authorized representative of that organization with the authority to bind such organization to these Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">3. Description of Services</h2>
            <p>
              Tivaro Business OS provides a comprehensive suite of cloud-based business management tools, including but not limited to inventory management, sales tracking, point-of-sale (POS) systems, financial reporting, and customer relationship management (CRM).
            </p>
            <p>
              We reserve the right to modify, update, upgrade, or discontinue any aspect of the Service at any time, with or without notice. We shall not be liable to you or to any third party for any modification, price change, suspension, or discontinuance of the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">4. User Accounts and Security</h2>
            <p>
              To access full functionality, you must create a registered account. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
            </p>
            <p>
              You are responsible for all data, content, or materials uploaded or created under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security. We will not be liable for any loss or damage arising from your failure to comply with this security obligation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">5. Fees, Payments, and Subscriptions</h2>
            <p>
              We offer both free and paid subscription tiers. By selecting a paid tier (e.g., PRO or Enterprise), you agree to pay all fees or charges to your account in accordance with the fees, charges, and billing terms in effect at the time a fee or charge is due and payable.
            </p>
            <p>
              Payments are processed through our authorized third-party payment gateways (including but not limited to PayMongo). You must provide valid credit card or payment information. By submitting such information, you grant us the right to provide the information to third parties for purposes of facilitating the completion of purchases initiated by you or on your behalf.
            </p>
            <p>
              All payments are non-refundable, except as expressly provided in these Terms or required by applicable law. We reserve the right to change our pricing at any time. Any price changes will be communicated to you with reasonable notice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">6. Intellectual Property Rights</h2>
            <p>
              Unless otherwise indicated, the Service is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Service (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights and unfair competition laws of the Philippines, foreign jurisdictions, and international conventions.
            </p>
            <p>
              The Content and the Marks are provided on the Service "AS IS" for your information and personal use only. Except as expressly provided in these Terms, no part of the Service and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">7. User Data and License</h2>
            <p>
              You retain all rights, title, and interest in and to any data, information, or material that you submit, upload, or process through the Service ("User Data"). Tivaro does not claim any ownership rights over your User Data.
            </p>
            <p>
              However, by submitting User Data to the Service, you grant us a worldwide, non-exclusive, royalty-free, fully paid-up license to use, host, store, reproduce, modify, and process such User Data solely for the purpose of operating, improving, and providing the Service to you.
            </p>
            <p>
              You represent and warrant that you have all necessary rights and permissions to grant this license and that your User Data does not infringe upon the rights of any third party.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">8. Prohibited Activities</h2>
            <p>
              You may not access or use the Service for any purpose other than that for which we make the Service available. The Service may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
            </p>
            <p>
              As a user of the Service, you agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Systematically retrieve data or other content from the Service to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
              <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
              <li>Circumvent, disable, or otherwise interfere with security-related features of the Service.</li>
              <li>Use any information obtained from the Service in order to harass, abuse, or harm another person.</li>
              <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
              <li>Use the Service in a manner inconsistent with any applicable laws or regulations.</li>
              <li>Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material that interferes with any party's uninterrupted use and enjoyment of the Service.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">9. Confidentiality</h2>
            <p>
              "Confidential Information" means all information disclosed by a party to the other party, whether orally or in writing, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure.
            </p>
            <p>
              Each party agrees to protect the Confidential Information of the other party in the same manner that it protects its own similar confidential information, but in no event using less than a reasonable degree of care. Confidential Information shall not include any information that is or becomes generally known to the public without breach of any obligation owed to the disclosing party.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">10. Term and Termination</h2>
            <p>
              These Terms shall remain in full force and effect while you use the Service. WITHOUT LIMITING ANY OTHER PROVISION OF THESE TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICE (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON.
            </p>
            <p>
              If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party, even if you may be acting on behalf of the third party.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">11. Limitation of Liability</h2>
            <p>
              IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p>
              NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE AMOUNT PAID, IF ANY, BY YOU TO US DURING THE SIX (6) MONTH PERIOD PRIOR TO ANY CAUSE OF ACTION ARISING.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">12. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys' fees and expenses, made by any third party due to or arising out of: (1) your User Data; (2) use of the Service; (3) breach of these Terms; (4) any breach of your representations and warranties set forth in these Terms; or (5) your violation of the rights of a third party, including but not limited to intellectual property rights.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">13. Dispute Resolution</h2>
            <p>
              Any dispute, controversy, or claim arising out of or relating to this Agreement, or the breach, termination, or invalidity thereof, shall be settled by arbitration in accordance with the Philippine Dispute Resolution Center, Inc. (PDRCI) Arbitration Rules as at present in force. The place of arbitration shall be Metro Manila, Philippines.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">14. Governing Law</h2>
            <p>
              These Terms and your use of the Service are governed by and construed in accordance with the laws of the Republic of the Philippines, without regard to its conflict of law principles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">15. Force Majeure</h2>
            <p>
              We shall not be liable for any failure or delay in performance of our obligations under this Agreement due to causes beyond our reasonable control, including but not limited to acts of God, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, network infrastructure failures, or strikes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">16. Contact Information</h2>
            <p>
              In order to resolve a complaint regarding the Service or to receive further information regarding use of the Service, please contact us at:
            </p>
            <p className="font-semibold text-foreground">
              Tivaro Support Team<br />
              Email: support@tivaro.com<br />
              Website: www.tivaro.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
