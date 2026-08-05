export default function AdminPageHeader({ title, subtitle, action }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <h1 className="font-heading text-2xl text-[#1A1A1A]">{title}</h1>
                {subtitle && <p className="text-sm text-[#5F6368] mt-1">{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}