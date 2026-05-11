import AiIcon from "./components/icons/aiIcon.svelte"
import PlanIcon from "./components/icons/planIcon.svelte"
import TeachingIcon from "./components/icons/teachingIcon.svelte"

export const NAV_MENU = [
    {
        title: "Home",
        url: "/"
    },
    {
        title: "Tentang Kami",
        url: "/about"
    },
    {
        title: "Program",
        url: "/programs"
    },
    {
        title: "Acara",
        url: "/events"
    }
]

export const BENEFITS = [
    {
        icon: TeachingIcon,
        title: "Belajar Langsung",
        description: "Interaksi langsung dengan mentor profesional untuk diskusi yang lebih mendalam dan intensif."
    },
    {
        icon: AiIcon,
        title: "Ai Integrated",
        description: "Kurikulum yang selalu adaptif terhadap perkembangan AI terkini dalam setiap workflow coding."
    },
    {
        icon: PlanIcon,
        title: "Project Based",
        description: "Belajar melalui pengerjaan proyek nyata yang mempersiapkan Anda untuk tantangan industri."
    },
]