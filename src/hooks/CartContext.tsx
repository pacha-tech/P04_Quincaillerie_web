"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/src/types/Cart';
import { panierService } from '../services/PanierService';
import toast from 'react-hot-toast';
import { NoInternetConnectionException } from '../exception/NoInternetConnectionException';
import { UserNotConnectedException } from '../exception/UserNotConnectedException';
import { ProductNotFoundException } from '../exception/ProductNotFoundException';
import { ProductAlreadyExistsException } from '../exception/ProductAlreadyExistsException';
import { AppException } from '../exception/AppException';

interface CartContextType {
  items: CartItem[];
  updateQuantity: (idPrice: string, delta: number) => Promise<void>;
  removeItem: (idPrice: string) => Promise<void>;
  clearCart: (idQuincaillerie: string) => Promise<void>;
  clearAll: () => Promise<void>;
  refreshCart: () => Promise<void>; 
  addToCart: (idPrice: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);


  useEffect(() => {
    const saved = localStorage.getItem('brixel_cart');
    if (saved) setItems(JSON.parse(saved));
    
    refreshCart();
  }, []);

  
  useEffect(() => {
    localStorage.setItem('brixel_cart', JSON.stringify(items));
  }, [items]);

  
  const handleCartError = (error: unknown, defaultMsg: string) => {
    if (error instanceof NoInternetConnectionException) {
      toast.error(error.message);
    } else if (error instanceof UserNotConnectedException) {
      toast.error("Veuillez vous connecter pour modifier le panier.");
    } else if (error instanceof ProductNotFoundException) {
      toast.error("Produit introuvable.");
    } else if (error instanceof ProductAlreadyExistsException) {
      toast.error(error.message || "Le produit existe déjà dans le panier.");
    } else if (error instanceof AppException) {
      toast.error(error.message);
    } else {
      toast.error(defaultMsg);
    }
  };

  const refreshCart = async () => {
    try {
      const carts = await panierService.getAllProductInPanier();
      setItems(carts);
    } catch (error) {
      console.error("Erreur lors de la récupération du panier:", error);
    }
  };

  const updateQuantity = async (idPrice: string, delta: number) => {
    const previousItems = [...items];
    const targetItem = items.find(item => item.idPrice === idPrice);
    const oldQuantity = targetItem ? targetItem.quantity : 0;
    
    // Mise à jour optimiste
    setItems(current => current.map(item => {
      if (item.idPrice === idPrice) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));

    try {
      if (delta > 0) {
        await panierService.addQuantityToPanier(idPrice);
        toast.success(`+1 ${targetItem?.productName || 'Article'} ajouté au panier`); 
      } else if (delta < 0 && oldQuantity === 1) {
        await panierService.deleteProductFromPanier(idPrice);
        toast.success(`${targetItem?.productName || 'Article'} retiré du panier`); 
      } else {
        await panierService.removeQuantityToPanier(idPrice);
      
        toast.success(`-1 ${targetItem?.productName || 'Article'} retiré du panier`); 
      }
    } catch (error) {
      setItems(previousItems);
      handleCartError(error, "Erreur lors de la modification de la quantité");
    }
  };

  const addToCart = async (idPrice: string) => {
    // Pas de modification optimiste ici car on n'a pas encore les détails (nom, image) du produit
    try {
      await panierService.addProductToPanier(idPrice);
      await refreshCart(); // Récupère le produit complet du serveur
      toast.success("Produit ajouté au panier !");
    } catch (error) {
      handleCartError(error, "Erreur lors de l'ajout au panier");
    }
  };

  const removeItem = async (idPrice: string) => {
    const previousItems = [...items];
    const targetItem = items.find(item => item.idPrice === idPrice);
    
    setItems(current => current.filter(item => item.idPrice !== idPrice));

    try {
      // CORRECTION: C'est deleteProductFromPanier ici !
      await panierService.deleteProductFromPanier(idPrice);
      toast.success(`${targetItem?.productName || 'Article'} supprimé !`);
    } catch (error) {
      setItems(previousItems);
      handleCartError(error, "Erreur lors de la suppression.");
    }
  };

  const clearCart = async (idQuincaillerie: string) => {
    const previousItems = [...items];
    setItems(current => current.filter(item => item.idQuincaillerie !== idQuincaillerie));

    try {
      await panierService.deletePanierByQuincaillerie(idQuincaillerie);
      toast.success("Le panier de cette boutique a été vidé.");
    } catch (error) {
      setItems(previousItems);
      handleCartError(error, "Erreur lors du vidage du panier.");
    }
  };

  const clearAll = async () => {
    const previousItems = [...items];
    setItems([]);
    
    try {
      await panierService.deleteAllPaniersByUser();
      toast.success("Tous vos paniers ont été vidés.");
    } catch (error) {
      setItems(previousItems);
      handleCartError(error, "Erreur lors de la suppression totale.");
    }
  };

  return (
    <CartContext.Provider value={{ items, updateQuantity, removeItem, clearCart, clearAll, refreshCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart doit être utilisé dans CartProvider");
  return context;
};