import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('baraka_cart');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return [];
            }
        }
        return [];
    });
    
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('baraka_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems(prev => {
            // Some products might not have an id but a name. Fallback to name if id is missing.
            const pId = product.id || product.name;
            const existing = prev.find(item => (item.id || item.name) === pId);
            if (existing) {
                return prev.map(item => 
                    (item.id || item.name) === pId ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1, id: pId }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => (item.id || item.name) !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return removeFromCart(productId);
        setCartItems(prev => prev.map(item => 
            (item.id || item.name) === productId ? { ...item, quantity: newQuantity } : item
        ));
    };

    const clearCart = () => setCartItems([]);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const cartTotal = cartItems.reduce((total, item) => total + ((item.price || 0) * item.quantity), 0);
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            isCartOpen,
            openCart,
            closeCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
