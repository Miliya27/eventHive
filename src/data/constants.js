export const ADMIN_EMAIL = "admin@college.edu";
export const ADMIN_PASSWORD = "Admin@2024";
export const COLLEGE_DOMAIN = "@college.edu";

export const initialClubs = [
  { id: 1, name: "Tech Society", color: "#3B82F6" },
  { id: 2, name: "Cultural Club", color: "#8B5CF6" },
  { id: 3, name: "Sports Council", color: "#10B981" },
];

const today = new Date();
const fmt = (d) => d.toISOString().split("T")[0];
const addDays = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return fmt(d);
};

export const initialEvents = [
  {
    id: 1,
    title: "HackFest 2024",
    clubId: 1,
    clubName: "Tech Society",
    date: addDays(5),
    time: "09:00",
    venue: "Main Auditorium",
    description: "24-hour coding marathon",
    category: "Hackathon",
    totalSeats: 120,
    registrations: 87,
    image: "💻",
  },
];

export const CATEGORIES = [
  "All",
  "Hackathon",
  "Cultural",
  "Sports",
];

export const CAT_COLORS = {
  Hackathon: "#3B82F6",
  Cultural: "#8B5CF6",
  Sports: "#10B981",
};