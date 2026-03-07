import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "Сколько стоит установка видеонаблюдения?",
    answer:
      "Стоимость зависит от количества камер, типа оборудования и сложности монтажа. Мы подбираем оптимальное решение под ваш объект и бюджет.",
    value: "item-1",
  },
  {
    question: "Можно ли смотреть камеры с телефона?",
    answer:
      "Да. После установки мы настраиваем удалённый доступ через телефон, планшет или компьютер. Вы сможете просматривать камеры из любой точки.",
    value: "item-2",
  },
  {
    question: "Сколько времени занимает установка?",
    answer:
      "Обычно установка системы занимает от нескольких часов до одного дня, в зависимости от размера объекта и количества камер.",
    value: "item-3",
  },
  {
    question: "Какие бренды оборудования вы используете?",
    answer:
      "Мы работаем с проверенными производителями: Hikvision, Dahua, Uniview, HiWatch и другими надёжными брендами.",
    value: "item-4",
  },
  {
    question: "Даете ли вы гарантию на монтаж?",
    answer:
      "Да. Мы предоставляем гарантию на установленное оборудование и выполненные монтажные работы.",
    value: "item-5",
  },
];

export const FAQ = () => {
  return (
    <section
      id="faq"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Часто задаваемые{" "}
        <span className="bg-gradient-to-r from-red-700 to-red-500 text-transparent bg-clip-text">
          вопросы
        </span>
      </h2>

      <Accordion
        type="single"
        collapsible
        className="w-full"
      >
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem
            key={value}
            value={value}
          >
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-6">
        Остались вопросы?{" "}
        <a
          rel="noreferrer noopener"
          href="https://wa.me/77000000000"
          className="text-red-700 transition-all border-red-700 hover:border-b-2"
        >
          Напишите нам в WhatsApp
        </a>
      </h3>
    </section>
  );
};