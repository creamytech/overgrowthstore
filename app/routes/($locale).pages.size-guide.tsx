import type {MetaFunction} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{title: 'Size Guide | Overgrowth'}];
};

const sizeData = {
  tops: {
    headers: ['Size', 'Chest (in)', 'Length (in)', 'Sleeve (in)'],
    rows: [
      ['S', '38-40', '27', '33'],
      ['M', '40-42', '28', '34'],
      ['L', '42-44', '29', '35'],
      ['XL', '44-46', '30', '36'],
      ['XXL', '46-48', '31', '37'],
    ],
  },
  bottoms: {
    headers: ['Size', 'Waist (in)', 'Inseam (in)', 'Hip (in)'],
    rows: [
      ['S', '28-30', '30', '38-40'],
      ['M', '30-32', '31', '40-42'],
      ['L', '32-34', '32', '42-44'],
      ['XL', '34-36', '32', '44-46'],
      ['XXL', '36-38', '32', '46-48'],
    ],
  },
};

export default function SizeGuide() {
  return (
    <div className="min-h-screen bg-[#F2EFE9]">
      {/* Hero */}
      <section className="bg-[#0a0a0a] py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.4em] uppercase block mb-6">
            Fit Reference
          </span>
          <h1 className="font-heading text-4xl md:text-6xl text-[#F2EFE9] uppercase tracking-[0.1em] mb-6">
            Size Guide
          </h1>
          <p className="font-mono text-sm text-[#F2EFE9]/60 max-w-lg mx-auto">
            Our pieces are designed with a relaxed, slightly oversized fit. 
            When in doubt, size down for a more fitted look.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* How to Measure */}
          <div className="mb-20">
            <h2 className="font-heading text-2xl text-[#0a0a0a] uppercase tracking-wide mb-8">
              How to Measure
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {title: 'Chest', desc: 'Measure around the fullest part of your chest, keeping the tape horizontal.'},
                {title: 'Waist', desc: 'Measure around your natural waistline, keeping the tape comfortably loose.'},
                {title: 'Length', desc: 'Measure from the highest point of the shoulder to the hem.'},
              ].map((item) => (
                <div key={item.title} className="p-6 border border-[#0a0a0a]/10">
                  <h3 className="font-heading text-lg text-[#0a0a0a] uppercase mb-2">{item.title}</h3>
                  <p className="font-mono text-xs text-[#8A8A84] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Model Reference */}
          <div className="mb-20 p-8 bg-[#0a0a0a]/5 border border-[#0a0a0a]/10">
            <h2 className="font-heading text-xl text-[#0a0a0a] uppercase tracking-wide mb-6">
              Model Reference
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <span className="font-mono text-[9px] text-[#8A8A84] uppercase tracking-widest block mb-2">
                  Men's Fit
                </span>
                <p className="font-mono text-sm text-[#0a0a0a] mb-1">
                  Model is 6'1" / 185 cm, 175 lbs / 79 kg
                </p>
                <p className="font-mono text-xs text-[#8A8A84]">
                  Wearing size <span className="text-[#B55A3C] font-bold">L</span> for relaxed fit
                </p>
              </div>
              <div>
                <span className="font-mono text-[9px] text-[#8A8A84] uppercase tracking-widest block mb-2">
                  Women's Fit
                </span>
                <p className="font-mono text-sm text-[#0a0a0a] mb-1">
                  Model is 5'7" / 170 cm, 130 lbs / 59 kg
                </p>
                <p className="font-mono text-xs text-[#8A8A84]">
                  Wearing size <span className="text-[#B55A3C] font-bold">M</span> for oversized fit
                </p>
              </div>
            </div>
          </div>

          {/* Tops Size Chart */}
          <div className="mb-16">
            <h2 className="font-heading text-2xl text-[#0a0a0a] uppercase tracking-wide mb-8">
              Tops
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#0a0a0a]">
                    {sizeData.tops.headers.map((header) => (
                      <th key={header} className="py-4 px-4 text-left font-mono text-xs uppercase tracking-wider text-[#0a0a0a]">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sizeData.tops.rows.map((row, i) => (
                    <tr key={i} className="border-b border-[#0a0a0a]/10">
                      {row.map((cell, j) => (
                        <td key={j} className={`py-4 px-4 font-mono text-sm ${j === 0 ? 'text-[#B55A3C] font-bold' : 'text-[#0a0a0a]'}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottoms Size Chart */}
          <div className="mb-16">
            <h2 className="font-heading text-2xl text-[#0a0a0a] uppercase tracking-wide mb-8">
              Bottoms
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#0a0a0a]">
                    {sizeData.bottoms.headers.map((header) => (
                      <th key={header} className="py-4 px-4 text-left font-mono text-xs uppercase tracking-wider text-[#0a0a0a]">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sizeData.bottoms.rows.map((row, i) => (
                    <tr key={i} className="border-b border-[#0a0a0a]/10">
                      {row.map((cell, j) => (
                        <td key={j} className={`py-4 px-4 font-mono text-sm ${j === 0 ? 'text-[#B55A3C] font-bold' : 'text-[#0a0a0a]'}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fit Notes */}
          <div className="p-8 bg-[#0a0a0a] text-[#F2EFE9]">
            <h3 className="font-heading text-lg uppercase mb-4">Fit Notes</h3>
            <ul className="space-y-3 font-mono text-xs text-[#F2EFE9]/70">
              <li className="flex items-start gap-3">
                <span className="text-[#B55A3C]">•</span>
                All measurements are in inches and are approximate
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#B55A3C]">•</span>
                Our tees are cut in a relaxed, boxy silhouette
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#B55A3C]">•</span>
                Heavyweight cotton may shrink 2-3% after first wash
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#B55A3C]">•</span>
                Questions? Email us at hello@overgrowth.co
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
