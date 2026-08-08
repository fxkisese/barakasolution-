import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { supabase } from "@/api/supabaseClient";
import { formatPrice } from "@/lib/siteData";
import { Image } from "@/components/ui/image";
import ProductModal from "./ProductModal";
import {
    CommandDialog,
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
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput 
                    placeholder="Search for furniture, categories, or styles..." 
                    value={search}
                    onValueChange={setSearch}
                    className="font-body text-obsidian"
                />
                <CommandList className="max-h-[60vh] overflow-y-auto">
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
                                className="flex items-center gap-4 cursor-pointer p-2 py-3 hover:bg-secondary transition-colors"
                            >
                                <div className="h-12 w-12 shrink-0 bg-secondary rounded-sm overflow-hidden">
                                    <Image
                                        src={p.image}
                                        alt={p.name}
                                        className="h-full w-full object-cover"
                                        fittingType="fill"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-heading text-lg text-obsidian truncate leading-tight">
                                        {p.name}
                                    </h4>
                                    <p className="text-[11px] uppercase tracking-[0.15em] text-basalt mt-0.5">
                                        {p.category}
                                    </p>
                                </div>
                                <div className="font-mono-price text-sm text-obsidian whitespace-nowrap">
                                    {formatPrice(p.price || 0)}
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>

            <ProductModal 
                isOpen={isProductModalOpen}
                setIsOpen={setIsProductModalOpen}
                product={selectedProduct}
            />
        </>
    );
}
