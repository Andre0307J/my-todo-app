import Spinner from "@/components/Spinner";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-96 gap-4">
      <Spinner size="large" />
      <p className="text-muted-foreground">Getting todo details...</p>
    </div>
  );
}