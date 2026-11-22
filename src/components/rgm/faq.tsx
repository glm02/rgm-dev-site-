import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Section, TitreMarqueur } from "./primitives";

export function Faq({ questions, debut = "Questions", marqueur = "fréquentes" }: { questions: { q: string; r: string }[]; debut?: string; marqueur?: string }) {
  return (
    <Section nom="Questions fréquentes" className="flex flex-col gap-4 pt-7 md:gap-8 md:pt-12">
      <TitreMarqueur debut={debut} marqueur={marqueur} />
      <Accordion defaultValue={["0"]}>
        {questions.map((item, i) => (
          <AccordionItem key={item.q} value={String(i)}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionContent>{item.r}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}
