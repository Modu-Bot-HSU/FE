export default function NftCardSkeleton() {
  return (
    <div className="aspect-square animate-pulse rounded-xl bg-slate-200">
      <div className="h-full w-full flex flex-col p-3">
        <div className="h-5 w-16 rounded bg-slate-300 mb-auto" />
        <div className="space-y-2 mt-2">
          <div className="h-4 w-full rounded bg-slate-300" />
          <div className="h-4 w-3/4 rounded bg-slate-300" />
        </div>
      </div>
    </div>
  );
}
