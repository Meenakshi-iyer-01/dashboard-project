export type Task = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};

export type TaskFilter = "All" | "Pending" | "Completed";
