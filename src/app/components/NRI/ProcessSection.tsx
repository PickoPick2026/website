import React from 'react';
import { Box, Boxes, MessageSquare, Plane } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Tell us what you need',
    description: 'Share your items, destination, and preferred pickup details.',
    icon: MessageSquare,
  },
  {
    number: '02',
    title: 'We source or collect',
    description: 'We shop for you or collect your purchases from anywhere in India.',
    icon: Box,
  },
  {
    number: '03',
    title: 'We prepare one shipment',
    description: 'We inspect, consolidate, and pack everything securely for the journey.',
    icon: Boxes,
  },
  {
    number: '04',
    title: 'You receive it abroad',
    description: 'Your shipment leaves India with tracking and arrives at your doorstep.',
    icon: Plane,
  },
];

export const ProcessSection: React.FC = () => (
  <section id="how-it-works" className="border-b border-slate-200 bg-white py-14 sm:py-18">
    <div className="mx-auto max-w-6xl px-4 sm:px-8">
      <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0B56D9]">Simple NRI shipping</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0A1931] sm:text-4xl">
          From India to you. We handle the rest.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
          One clear process from your first request to your overseas doorstep.
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-0">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={step.number}>
              <article className="relative flex-1 rounded-2xl border border-blue-100 bg-[#F7F9FF] p-5 sm:p-6 lg:min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B56D9] text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-black tracking-[0.2em] text-[#0B56D9]">{step.number}</span>
                </div>
                <h3 className="mt-5 text-base font-extrabold text-[#0A1931]">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">{step.description}</p>
              </article>
              {index < steps.length - 1 && (
                <div className="flex h-8 shrink-0 items-center justify-center lg:w-16 lg:self-center">
                  <img
                    src="/images/nri-process-route-arrow-v1.png"
                    alt=""
                    aria-hidden="true"
                    className="h-10 w-16 rotate-90 object-contain lg:h-12 lg:w-16 lg:rotate-0"
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  </section>
);
