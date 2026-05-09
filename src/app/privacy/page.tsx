'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-8 bg-white p-8 md:p-12 rounded-3xl border border-border shadow-sm">
        
        <Link href="/login" className="text-sm text-primary font-medium hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <div className="space-y-4">
          <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: May 9, 2026</p>
        </div>

        <div className="space-y-6 text-sm text-foreground/80 leading-relaxed">
          <p className="font-medium text-foreground">
            Tivaro ("we", "us", or "our") operates the Tivaro Business OS platform. This Privacy Policy informs you of our policies regarding the collection, use, and disclosure of personal and business data when you use our Service and the choices you have associated with that data.
          </p>
          <p>
            We are committed to protecting your privacy and complying with the **Data Privacy Act of 2012 (Republic Act No. 10173)** of the Philippines and other applicable global data protection regulations.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">1. Information We Collect</h2>
            <p>
              We collect several different types of information for various purposes to provide and improve our Service to you.
            </p>
            <h3 className="font-semibold text-foreground">A. Personal Data</h3>
            <p>
              While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Phone number</li>
              <li>Business Name and Address</li>
              <li>Billing Information and Tax ID</li>
            </ul>

            <h3 className="font-semibold text-foreground">B. Business and Operational Data</h3>
            <p>
              To provide the core functionality of Tivaro Business OS, we collect and store the data you input regarding your business operations, including:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Inventory and Product details</li>
              <li>Sales transactions and receipts</li>
              <li>Customer lists and contact details</li>
              <li>Expense records and financial data</li>
            </ul>

            <h3 className="font-semibold text-foreground">C. Usage Data and Cookies</h3>
            <p>
              We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
            </p>
            <p>
              We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">2. How We Use Your Information</h2>
            <p>
              Tivaro uses the collected data for various purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
              <li>To process your payments and prevent fraudulent transactions</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">3. Data Retention</h2>
            <p>
              Tivaro will retain your Personal Data and Business Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
            </p>
            <p>
              Usage Data will generally be retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of our Service, or we are legally obligated to retain this data for longer time periods.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">4. Data Transfer and Storage</h2>
            <p>
              Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.
            </p>
            <p>
              If you are located in the Philippines and choose to provide information to us, please note that we may transfer the data, including Personal Data, to secure cloud servers located outside the Philippines and process it there.
            </p>
            <p>
              Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">5. Disclosure of Data</h2>
            <h3 className="font-semibold text-foreground">A. Disclosure for Law Enforcement</h3>
            <p>
              Under certain circumstances, Tivaro may be required to disclose your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).
            </p>
            <h3 className="font-semibold text-foreground">B. Legal Requirements</h3>
            <p>
              Tivaro may disclose your Personal Data in the good faith belief that such action is necessary to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>To comply with a legal obligation</li>
              <li>To protect and defend the rights or property of Tivaro</li>
              <li>To prevent or investigate possible wrongdoing in connection with the Service</li>
              <li>To protect the personal safety of users of the Service or the public</li>
              <li>To protect against legal liability</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">6. Data Security</h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security. We employ SSL encryption, firewalls, and regular security audits to protect your data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">7. Third-Party Service Providers</h2>
            <p>
              We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.
            </p>
            <p>
              These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Payments:</strong> We use third-party services for payment processing (e.g. PayMongo). We will not store or collect your payment card details. That information is provided directly to our third-party payment processors whose use of your personal information is governed by their Privacy Policy.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">8. Your Rights Under the Data Privacy Act</h2>
            <p>
              If you are a resident of the Philippines, you have certain rights under the Data Privacy Act of 2012. Tivaro aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.
            </p>
            <p>
              You have the following rights:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Right to be informed:</strong> To know whether your personal data is being processed.</li>
              <li><strong>Right to access:</strong> To request a copy of the data we hold about you.</li>
              <li><strong>Right to rectification:</strong> To correct any inaccurate or incomplete data.</li>
              <li><strong>Right to erasure or blocking:</strong> To request the deletion of your data from our system.</li>
              <li><strong>Right to object:</strong> To object to the processing of your data in certain circumstances.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">9. Children's Privacy</h2>
            <p>
              Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">10. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact our Data Protection Officer at:
            </p>
            <p className="font-semibold text-foreground">
              Tivaro Data Protection Office<br />
              Email: privacy@tivaro.com<br />
              Address: Metro Manila, Philippines
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
