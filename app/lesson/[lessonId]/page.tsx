import { getLesson, getUserProgress } from "@/lib/queries";
import { redirect } from "next/navigation";
import { Quiz } from "../Quiz";

type Props = {
    params: {
        lessonId: number;
    };
};

const LessonIDPage = async ({ params }: Props) => {
    const lessonData = getLesson(params.lessonId);
    const userProgress = getUserProgress();

    const [lesson, progress] = await Promise.all([
        lessonData, userProgress,
    ]);

    if (!lesson || !progress) {
        redirect("/learn");
    }

    // Map the data to match the expected type structure
    const mappedChallenges = lesson.challenges.map((challenge) => ({
        ...challenge,
        challengeOptions: challenge.challenge_options, // Rename challenge_options to challengeOptions
    }));

    const initialPercent = (lesson.challenges.filter((ch) => ch.completed).length / lesson.challenges.length) * 100;

    return (
        <Quiz
            lsnChallenges={mappedChallenges}
            lsnId={lesson.id}
            hearts={progress.hearts}
            percent={initialPercent}
        />
    );
};

export default LessonIDPage;
