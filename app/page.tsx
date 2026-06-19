import { buildQuestions } from "@/lib/build-questions";
import { Quiz } from "@/components/Quiz";

// Rebuild questions from the GitHub API on every page load — never cached,
// so the snippet set changes each visit.
export const dynamic = "force-dynamic";

export default async function Page() {
  const questions = await buildQuestions(6);

  if (questions.length === 0) {
    return (
      <main className="mx-auto mt-24 max-w-md px-6 text-center">
        <h1 className="text-[20px] font-semibold text-text">
          Couldn&apos;t load questions
        </h1>
        <p className="mt-2 text-[15px] text-text-2">
          The GitHub API didn&apos;t return any snippets. Check that{" "}
          <code className="font-mono text-text-muted">GITHUB_TOKEN</code> is set
          in <code className="font-mono text-text-muted">.env</code>, then
          reload.
        </p>
      </main>
    );
  }

  return <Quiz questions={questions} />;
}
