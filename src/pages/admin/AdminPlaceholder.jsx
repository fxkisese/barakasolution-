import AdminPageHeader from "@/components/admin/AdminPageHeader";

export default function AdminPlaceholder({ title }) {
    return (
        <div className="p-8">
            <AdminPageHeader title={title} subtitle="Part of the Luxe Craft admin suite." />
            <div className="mt-10 grid place-items-center h-64 border border-dashed border-[#EAEBED] rounded-xl bg-white">
                <p className="text-[#5F6368] text-sm">Coming soon</p>
            </div>
        </div>
    );
}