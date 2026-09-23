import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import AskForm from "@/components/AskForm";
import QuestionWall from "@/components/QuestionWall";
import DuckLore from "@/components/DuckLore";
import Episodes from "@/components/Episodes";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import { listPublic } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const approved = await listPublic();

  const cards = approved.map((q) => ({
    id: q.id,
    body: q.body,
    category: q.category,
    name: q.name,
    city: q.city,
    isExample: false,
  }));

  return (
    <>
      <Preloader />
      <Nav />
      <main>
        <Hero />
        <About />
        <AskForm />
        <QuestionWall real={cards} />
        <DuckLore />
        <Episodes />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
