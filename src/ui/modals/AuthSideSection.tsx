import React from 'react';

type AuthVariant = 'login' | 'register' | 'forgot-password';

interface AuthSideSectionProps {
  variant?: AuthVariant;
}

const contentMap: Record<
  AuthVariant,
  { indicator: string; title: React.ReactNode; description: string }
> = {
  login: {
    indicator: '// CORE INTERCONNECT NODE',
    title: (
      <>
        Every execution. <br />
        <span className="text-blue-200 underline decoration-2 decoration-blue-300/40 underline-offset-4">
          Signal guaranteed.
        </span>
      </>
    ),
    description:
      'Log into your structural routing dashboard to manage live direct carrier lanes, audit transactional token payloads, and handle SME fallback scripts.',
  },
  register: {
    indicator: '// PROVISION INFRASTRUCTURE NODE',
    title: (
      <>
        Scale messaging. <br />
        <span className="text-blue-200 underline decoration-2 decoration-blue-300/40 underline-offset-4">
          Zero carrier loss.
        </span>
      </>
    ),
    description:
      'Provision your developer node to access real-time SMS & email dispatch APIs, high-throughput template workflows, and direct carrier routes.',
  },
  'forgot-password': {
    indicator: '// SECURE RECOVERY PROTOCOL',
    title: (
      <>
        Account access. <br />
        <span className="text-blue-200 underline decoration-2 decoration-blue-300/40 underline-offset-4">
          Safely restored.
        </span>
      </>
    ),
    description:
      'Initiate an encrypted credential recovery flow to dispatch a password reset link to your verified primary administration email.',
  },
};

const AuthSideSection = ({ variant = 'login' }: AuthSideSectionProps) => {
  const content = contentMap[variant];

  return (
    <section className="hidden lg:flex flex-col justify-between p-16 bg-[#004aad] relative overflow-hidden">
      {/* Subtle structural canvas pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(white 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Corner: Brand Heading Indicator */}
      <div className="relative z-10 flex items-center gap-2">
        <span className="font-mono text-xs font-bold text-blue-200 tracking-widest uppercase">
          {content.indicator}
        </span>
      </div>

      {/* Middle Content: Contextual Value Proposition */}
      <div className="relative z-10 flex flex-col gap-4 max-w-md my-auto">
        <h2 className="text-4xl font-black text-white tracking-tight leading-none">
          {content.title}
        </h2>
        <p className="text-sm text-blue-100/80 leading-relaxed font-medium">
          {content.description}
        </p>
      </div>

      {/* Bottom Footer: Real Hard Telemetry Counters */}
      <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-blue-400/30 pt-8 font-mono">
        <div className="flex flex-col">
          <span className="text-xl font-black text-white tracking-tight">500M+</span>
          <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mt-0.5">
            Transactions
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black text-white tracking-tight">99.97%</span>
          <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mt-0.5">
            Uptime SLA
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black text-white tracking-tight">4 Nodes</span>
          <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mt-0.5">
            Local Telcos
          </span>
        </div>
      </div>
    </section>
  );
};

export default AuthSideSection;