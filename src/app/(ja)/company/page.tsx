import { content } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "会社概要 | 株式会社KAI",
};

export default function CompanyPage() {
  const t = content.ja.company;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="mb-12 text-2xl font-bold text-navy">{t.title}</h1>

        <div className="overflow-hidden rounded border border-gray-border">
          <table className="w-full text-sm">
            <tbody>
              {t.rows.map((row) => (
                <tr key={row.label} className="border-b border-gray-border last:border-b-0">
                  <th className="w-40 bg-gray-light px-6 py-4 text-left font-medium text-navy">
                    {row.label}
                  </th>
                  <td className="whitespace-pre-line px-6 py-4 text-gray-sub">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
