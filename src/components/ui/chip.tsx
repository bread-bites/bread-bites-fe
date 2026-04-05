export default function Chip({ label, onClick } : { label: string, onClick?: () => void }) {
  return (
    <div
      className="flex h-6 items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium whitespace-nowrap text-foreground hover:bg-white/10 cursor-pointer"
      onClick={onClick}
    >
      {label}
    </div>
  )
}
