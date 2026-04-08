import { LoginForm } from "@components/auth/LoginForm";

const features = [
  "HR & Payroll Management",
  "Inventory & Supply Chain",
  "Sales & CRM",
  "Financial Reporting",
];

export default function Home() {
  return (
    <div className="flex h-screen">
      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12">
        <div>
          <span className="text-2xl font-bold text-white tracking-tight">
            Oretech<span className="text-indigo-400">ERP</span>
          </span>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Manage your business
            <br />
            with confidence
          </h1>
          <p className="text-slate-400 text-lg">
            Streamlined operations, real-time insights, and complete control
            over your enterprise.
          </p>

          <ul className="mt-8 space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-slate-300">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span className="text-sm">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-slate-600 text-xs">
          © {new Date().getFullYear()} Oretech. All rights reserved.
        </p>
      </div>

      {/* ── Right login panel ── */}
      <div className="flex-1 flex justify-center items-center p-8 bg-white">
        <LoginForm />
      </div>
    </div>
  );
}
