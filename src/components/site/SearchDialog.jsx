import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { supabase } from "@/api/supabaseClient";
import { formatPrice } from "@/lib/siteData";
import { Image } from "@/components/ui/image";
import ProductModal from "./ProductModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

export default function SearchDialog({ open, setOpen }) {
    const [search, setSearch] = useState("");
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Product Modal State
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    useEffect(() => {
        if (open && allProducts.length === 0) {
            fetchProducts();
        }
    }, [open]);

    async function fetchProducts() {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (data && !error) {
            setAllProducts(data);
        }
        setLoading(false);
    }

    const handleSelectProduct = (product) => {
        setOpen(false);
        setSearch("");
        setSelectedProduct(product);
        setIsProductModalOpen(true);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="overflow-hidden p-0 bg-silk border-none shadow-2xl max-w-2xl">
                    <Command className="bg-silk text-obsidian [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.15em] [&_[cmdk-group-heading]]:text-basalt [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-14 [&_[cmdk-item]]:px-3 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
                        <div className="border-b border-obsidian/10">
                            <CommandInput 
                                placeholder="Search for furniture, categories, or styles..." 
                                value={search}
                                onValueChange={setSearch}
                                className="font-body text-obsidian text-base"
                            />
                        </div>
                        <CommandList className="max-h-[60vh] overflow-y-auto py-2 custom-scrollbar">
                    {loading && <CommandEmpty>Loading products...</CommandEmpty>}
                    {!loading && allProducts.length > 0 && (
                        <CommandEmpty>No results found for "{search}".</CommandEmpty>
                    )}
                    
                    <CommandGroup heading="Products">
                        {allProducts.map((p) => (
                            <CommandItem
                                key={p.id || p.name}
                                value={`${p.name} ${p.category}`}
                                onSelect={() => handleSelectProduct(p)}
                                className="flex items-center gap-5 cursor-pointer p-3 rounded-sm aria-selected:bg-obsidian/5 aria-selected:text-obsidian hover:bg-obsidian/5 transition-colors duration-200"
                            >
                                <div className="h-14 w-14 shrink-0 bg-secondary rounded overflow-hidden">
                                    <Image
                                        src={p.image}
                                        alt={p.name}
                                        className="h-full w-full object-cover mix-blend-multiply"
                                        fittingType="fill"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-heading text-xl text-obsidian truncate leading-tight">
                                        {p.name}
                                    </h4>
                                    <p className="text-[11px] uppercase tracking-[0.15em] text-basalt mt-1">
                                        {p.category}
                                    </p>
                                </div>
                                <div className="font-mono-price text-[15px] text-obsidian whitespace-nowrap pl-4">
                                    {formatPrice(p.price || 0)}
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
                </Command>
            </Dialog>

            <ProductModal 
                isOpen={isProductModalOpen}
                setIsOpen={setIsProductModalOpen}
                product={selectedProduct}
            />
        </>
    );
}
