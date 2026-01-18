import type {MetaFunction} from '@remix-run/react';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '~/components/ui/accordion';
import {Spotlight} from '~/components/ui/spotlight';

export const meta: MetaFunction = () => {
  return [{title: 'Shipping & Returns | Overgrowth'}];
};

const shippingInfo = [
  {
    question: 'How long does shipping take?',
    answer: 'Domestic orders (USA) typically arrive within 3-7 business days. International orders take 7-14 business days depending on your location. All orders include tracking.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Yes! We ship to 50+ countries including Canada, UK, Germany, France, Australia, Japan, South Korea, and more. International shipping rates and duties are calculated at checkout. Please note that you may be responsible for import taxes or duties in your country.',
  },
  {
    question: 'How much does shipping cost?',
    answer: 'Free shipping on all orders over $150 within the USA. Standard domestic shipping is $8. International shipping starts at $15 and varies by location.',
  },
  {
    question: 'Can I track my order?',
    answer: 'Yes, you\'ll receive a tracking number via email once your order ships. You can also track your order through your account dashboard.',
  },
];

const returnsInfo = [
  {
    question: 'What is your return policy?',
    answer: 'We don\'t accept returns due to the scarcity of each product. Every piece is part of a limited run, and once it\'s gone, it\'s gone forever.',
  },
  {
    answer: 'If you receive a damaged or defective item, contact us immediately at customerservice@overgrowth.co with photos of the damage. We\'ll work with you to make it right.',
  },
  {
    question: 'Can I exchange an item?',
    answer: 'Unfortunately, due to the limited nature of our products, we are unable to offer exchanges. Please refer to our size guide before ordering.',
  },
  {
    question: 'Why don\'t you accept returns?',
    answer: 'Each Overgrowth piece is produced in extremely limited quantities. Once sold, these items cannot be restocked. This scarcity is core to our model and ensures each piece remains special.',
  },
];

export default function ShippingReturns() {
  return (
    <div className="min-h-screen bg-[#F2EFE9]">
      {/* Hero */}
      <section className="relative bg-[#0a0a0a] py-24 md:py-32 overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#B55A3C" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.4em] uppercase block mb-6">
            Policies
          </span>
          <h1 className="font-heading text-4xl md:text-6xl text-[#F2EFE9] uppercase tracking-[0.1em] mb-6">
            Shipping & Returns
          </h1>
          <p className="font-mono text-sm text-[#F2EFE9]/60 max-w-lg mx-auto">
            Everything you need to know about getting your order and our return policy.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 md:py-32">
        <div className="max-w-3xl mx-auto px-6">
          
          {/* Shipping Section */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-[#B55A3C]" />
              <h2 className="font-heading text-2xl text-[#0a0a0a] uppercase tracking-wide">
                Shipping
              </h2>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              {shippingInfo.map((item, index) => (
                <AccordionItem key={index} value={`shipping-${index}`} className="border-b border-[#0a0a0a]/10">
                  <AccordionTrigger className="py-6 font-heading text-lg text-[#0a0a0a] hover:text-[#B55A3C] uppercase tracking-wide text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 font-mono text-sm text-[#8A8A84] leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Returns Section */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-[#B55A3C]" />
              <h2 className="font-heading text-2xl text-[#0a0a0a] uppercase tracking-wide">
                Returns & Exchanges
              </h2>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              {returnsInfo.map((item, index) => (
                <AccordionItem key={index} value={`returns-${index}`} className="border-b border-[#0a0a0a]/10">
                  <AccordionTrigger className="py-6 font-heading text-lg text-[#0a0a0a] hover:text-[#B55A3C] uppercase tracking-wide text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 font-mono text-sm text-[#8A8A84] leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Quick Reference */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#0a0a0a] text-[#F2EFE9]">
              <span className="font-mono text-[9px] text-[#B55A3C] tracking-widest uppercase block mb-3">
                Free Shipping
              </span>
              <span className="font-heading text-2xl">$150+</span>
              <p className="font-mono text-xs text-[#F2EFE9]/50 mt-2">USA orders</p>
            </div>
            <div className="p-6 bg-[#0a0a0a] text-[#F2EFE9]">
              <span className="font-mono text-[9px] text-[#B55A3C] tracking-widest uppercase block mb-3">
                Returns
              </span>
              <span className="font-heading text-2xl">Final Sale</span>
              <p className="font-mono text-xs text-[#F2EFE9]/50 mt-2">Due to scarcity</p>
            </div>
            <div className="p-6 bg-[#0a0a0a] text-[#F2EFE9]">
              <span className="font-mono text-[9px] text-[#B55A3C] tracking-widest uppercase block mb-3">
                Processing
              </span>
              <span className="font-heading text-2xl">1-2 Days</span>
              <p className="font-mono text-xs text-[#F2EFE9]/50 mt-2">Order handling</p>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-16 text-center p-8 border border-[#0a0a0a]/10">
            <p className="font-mono text-sm text-[#8A8A84] mb-4">
              Still have questions?
            </p>
            <a 
              href="mailto:customerservice@overgrowth.co"
              className="font-heading text-xl text-[#0a0a0a] hover:text-[#B55A3C] transition-colors"
            >
              customerservice@overgrowth.co
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
