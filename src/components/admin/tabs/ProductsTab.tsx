'use client';

import React, { useState, useMemo } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import { Product } from '@/types/marketplace';
import { formatBDT } from '@/lib/formatters';
import { 
  Package, 
  Search, 
  Tag, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  X, 
  DollarSign, 
  Layers, 
  Sparkles,
  Sliders,
  Check
} from 'lucide-react';

export function ProductsTab() {
  const { products: resellerProducts, isLoadingProducts, updateProductModeration } = useAdmin();
  const { products: catalogProducts, addProduct, updateProduct, deleteProduct, showToast } = useMarketplace();

  const [activeCatalogTab, setActiveCatalogTab] = useState<'platform-catalog' | 'reseller-products'>('platform-catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');

  // Modal State for Adding/Editing Platform Product
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Product Form Fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Electronics');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formSupplierPrice, setFormSupplierPrice] = useState<number>(1200);
  const [formSuggestedPrice, setFormSuggestedPrice] = useState<number>(1850);
  const [formStockCount, setFormStockCount] = useState<number>(50);
  const [formDescription, setFormDescription] = useState('');
  const [formBenefits, setFormBenefits] = useState<string>('High-demand viral product\nNationwide Cash on Delivery\n7-Day replacement warranty');
  const [formIsActive, setFormIsActive] = useState<boolean>(true);

  // Calculated profit
  const calculatedProfit = Math.max(0, formSuggestedPrice - formSupplierPrice);
  const calculatedMargin = formSuggestedPrice > 0 ? Math.round((calculatedProfit / formSuggestedPrice) * 100) : 0;

  const openAddModal = () => {
    setEditingProductId(null);
    setFormName('');
    setFormCategory('Electronics');
    setFormImageUrl('https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800');
    setFormSupplierPrice(1200);
    setFormSuggestedPrice(1850);
    setFormStockCount(50);
    setFormDescription('Authentic high-demand wholesale product for Bangladesh resellers. Ready for nationwide COD dispatch.');
    setFormBenefits('High-demand viral product\nNationwide Cash on Delivery\n7-Day replacement warranty');
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProductId(prod.id);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormImageUrl(prod.imageUrl);
    setFormSupplierPrice(prod.supplierPrice || Math.round(prod.price * 0.65));
    setFormSuggestedPrice(prod.suggestedPrice || prod.price);
    setFormStockCount(prod.stockCount || 50);
    setFormDescription(prod.description);
    setFormBenefits((prod.benefits || ['100% Cash on Delivery across Bangladesh', '7-Day warranty']).join('\n'));
    setFormIsActive(prod.isActive !== false);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Validation Error', 'Product name is required.', 'error');
      return;
    }

    const benefitsArray = formBenefits
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: formName,
        category: formCategory,
        imageUrl: formImageUrl,
        price: formSuggestedPrice,
        suggestedPrice: formSuggestedPrice,
        supplierPrice: formSupplierPrice,
        resellerProfit: calculatedProfit,
        stockCount: formStockCount,
        inStock: formStockCount > 0,
        description: formDescription,
        benefits: benefitsArray,
        isActive: formIsActive
      });
      showToast('Product Updated', `"${formName}" has been updated in wholesale catalog.`, 'success');
    } else {
      addProduct({
        name: formName,
        category: formCategory,
        imageUrl: formImageUrl,
        price: formSuggestedPrice,
        suggestedPrice: formSuggestedPrice,
        supplierPrice: formSupplierPrice,
        resellerProfit: calculatedProfit,
        stockCount: formStockCount,
        inStock: formStockCount > 0,
        description: formDescription,
        benefits: benefitsArray,
        isActive: formIsActive
      });
      showToast('Product Created', `"${formName}" is now available for all resellers to sell.`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleToggleActiveStatus = (prod: Product) => {
    const currentActive = prod.isActive !== false;
    updateProduct(prod.id, { isActive: !currentActive });
    showToast(
      currentActive ? 'Product Unpublished' : 'Product Published',
      `"${prod.name}" is now ${currentActive ? 'hidden from' : 'visible to'} resellers.`,
      'info'
    );
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to remove "${productName}" from the wholesale catalog?`)) {
      deleteProduct(productId);
      showToast('Product Removed', `"${productName}" removed from catalog.`, 'info');
    }
  };

  // Filtered Master Catalog
  const filteredCatalog = useMemo(() => {
    return catalogProducts.filter(p => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = (p.name || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        if (!name.includes(q) && !cat.includes(q)) return false;
      }
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (stockFilter === 'in_stock' && (!p.inStock || (p.stockCount ?? 0) <= 0)) return false;
      if (stockFilter === 'out_of_stock' && p.inStock && (p.stockCount ?? 0) > 0) return false;
      return true;
    });
  }, [catalogProducts, searchQuery, categoryFilter, stockFilter]);

  // Filtered Reseller Offerings
  const filteredResellerProducts = useMemo(() => {
    return resellerProducts.filter(p => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = (p.productName || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        const rId = (p.resellerId || '').toLowerCase();
        if (!name.includes(q) && !cat.includes(q) && !rId.includes(q)) return false;
      }
      if (stockFilter === 'in_stock' && p.inStock === false) return false;
      if (stockFilter === 'out_of_stock' && p.inStock !== false) return false;
      return true;
    });
  }, [resellerProducts, searchQuery, stockFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white border border-[#E6E4E0] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#111111]">Platform Wholesale Catalog &amp; Reseller Products</h2>
            <p className="text-xs text-neutral-500">
              Add new wholesale products for resellers, configure supplier costs, suggested selling prices, and track reseller listings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openAddModal}
              className="px-4 py-2.5 rounded-xl bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Wholesale Product</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E6E4E0] pt-2">
          <button
            type="button"
            onClick={() => setActiveCatalogTab('platform-catalog')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeCatalogTab === 'platform-catalog'
                ? 'border-[#111111] text-[#111111]'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Master Wholesale Products ({catalogProducts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCatalogTab('reseller-products')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeCatalogTab === 'reseller-products'
                ? 'border-[#111111] text-[#111111]'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active Reseller Listings ({resellerProducts.length})</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, SKU, or category..."
              className="w-full pl-9.5 pr-4 py-2 text-xs rounded-xl border border-[#E6E4E0] bg-[#F7F6F3] focus:bg-white focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E4E0] bg-[#F7F6F3] focus:bg-white focus:outline-none font-medium text-neutral-800"
            >
              <option value="all">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Beauty">Beauty</option>
              <option value="Home & Living">Home &amp; Living</option>
              <option value="Sports">Sports</option>
              <option value="Groceries">Groceries</option>
            </select>
          </div>

          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E4E0] bg-[#F7F6F3] focus:bg-white focus:outline-none font-medium text-neutral-800"
            >
              <option value="all">All Stock Statuses</option>
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* VIEW 1: Master Platform Wholesale Catalog */}
      {activeCatalogTab === 'platform-catalog' && (
        <div className="bg-white border border-[#E6E4E0] rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F3] border-b border-[#E6E4E0] text-neutral-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">Supplier Cost</th>
                  <th className="py-3 px-4">Suggested Retail</th>
                  <th className="py-3 px-4">Reseller Profit</th>
                  <th className="py-3 px-4">Inventory</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredCatalog.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-neutral-400">
                      No wholesale products match your search.
                    </td>
                  </tr>
                ) : (
                  filteredCatalog.map((prod) => {
                    const supplierCost = prod.supplierPrice || Math.round(prod.price * 0.65);
                    const suggestedPrice = prod.suggestedPrice || prod.price;
                    const profit = prod.resellerProfit !== undefined 
                      ? prod.resellerProfit 
                      : Math.max(0, suggestedPrice - supplierCost);
                    const isActive = prod.isActive !== false;

                    return (
                      <tr key={prod.id} className="hover:bg-[#FAF9F5] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.imageUrl}
                              alt=""
                              className="w-10 h-10 rounded-xl object-cover border border-neutral-200 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-neutral-900 line-clamp-1">{prod.name}</div>
                              <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                                <span>{prod.category}</span>
                                <span>•</span>
                                <span>SKU: {prod.sku || prod.id}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-bold text-neutral-800">
                          {formatBDT(supplierCost)}
                        </td>

                        <td className="py-3 px-4 font-bold text-neutral-900">
                          {formatBDT(suggestedPrice)}
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-extrabold text-emerald-600">
                            +{formatBDT(profit)}
                          </span>
                          <span className="text-[10px] text-neutral-400 block">
                            ({suggestedPrice > 0 ? Math.round((profit / suggestedPrice) * 100) : 0}% margin)
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            prod.inStock && (prod.stockCount ?? 0) > 0
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {prod.inStock ? `${prod.stockCount || 50} in stock` : 'Out of stock'}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleActiveStatus(prod)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                              isActive
                                ? 'bg-neutral-900 text-white'
                                : 'bg-neutral-200 text-neutral-600'
                            }`}
                          >
                            {isActive ? 'Published' : 'Hidden'}
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditModal(prod)}
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                              title="Edit product economics & stock"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete from catalog"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: Active Reseller Listings */}
      {activeCatalogTab === 'reseller-products' && (
        <div className="bg-white border border-[#E6E4E0] rounded-2xl shadow-xs overflow-hidden">
          {isLoadingProducts ? (
            <div className="py-16 text-center text-xs text-neutral-500">
              Loading reseller products from Firestore...
            </div>
          ) : filteredResellerProducts.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Package className="w-8 h-8 text-neutral-300 mx-auto" />
              <p className="text-xs font-semibold text-neutral-700">No reseller product listings found</p>
              <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
                When registered resellers add products to their inventories or landing pages, they will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F6F3] border-b border-[#E6E4E0] text-neutral-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Reseller UID</th>
                    <th className="py-3 px-4">Supplier Cost</th>
                    <th className="py-3 px-4">Selling Price</th>
                    <th className="py-3 px-4">Reseller Margin</th>
                    <th className="py-3 px-4">Stock Status</th>
                    <th className="py-3 px-4 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredResellerProducts.map((prod) => {
                    const supplier = Number(prod.supplierPriceBDT || 0);
                    const selling = Number(prod.sellingPriceBDT || 0);
                    const margin = Math.max(0, selling - supplier);
                    const inStock = prod.inStock !== false;

                    return (
                      <tr key={prod.id} className="hover:bg-[#FAF9F5] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            {prod.imageUrl ? (
                              <img src={prod.imageUrl} alt="" className="w-9 h-9 rounded-lg object-cover border border-neutral-200 shrink-0" />
                            ) : (
                              <div className="w-9 h-9 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0">
                                <Package className="w-4 h-4 text-neutral-400" />
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-neutral-900 line-clamp-1">{prod.productName}</div>
                              <div className="text-[10px] text-neutral-500">{prod.category || 'General'}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-600">
                          {prod.resellerId ? prod.resellerId.slice(0, 12) + '...' : 'Unknown'}
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-neutral-700">
                          {formatBDT(supplier)}
                        </td>

                        <td className="py-3.5 px-4 font-bold text-neutral-900">
                          {formatBDT(selling)}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-black text-emerald-600">+{formatBDT(margin)}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => updateProductModeration(prod.id, { inStock: !inStock })}
                            className="px-2.5 py-1 rounded-lg border border-neutral-200 text-[11px] font-semibold hover:bg-neutral-100 transition-colors"
                          >
                            Toggle Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal: Add or Edit Wholesale Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E6E4E0] max-w-xl w-full p-6 shadow-xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                  {editingProductId ? 'Edit Wholesale Product' : 'Add Wholesale Product for Resellers'}
                </h3>
                <p className="text-xs text-neutral-500">
                  Configure supplier pricing, suggested retail price, and reseller earnings.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Product Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g., Ultra Wireless ANC Earbuds"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:border-black font-medium"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Home & Living">Home &amp; Living</option>
                    <option value="Sports">Sports</option>
                    <option value="Groceries">Groceries</option>
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Product Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:border-black"
                />
              </div>

              {/* Financial Economics Matrix */}
              <div className="p-3.5 bg-[#F7F6F3] rounded-2xl border border-neutral-200 space-y-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-600 block">
                  Wholesale Economics (BDT / ৳)
                </span>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                      Supplier Base Cost (৳)
                    </label>
                    <input
                      type="number"
                      min="10"
                      required
                      value={formSupplierPrice}
                      onChange={(e) => setFormSupplierPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-white font-bold text-neutral-800"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                      Suggested Retail (৳)
                    </label>
                    <input
                      type="number"
                      min="10"
                      required
                      value={formSuggestedPrice}
                      onChange={(e) => setFormSuggestedPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-white font-bold text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-emerald-700 block mb-1">
                      Reseller Net Profit
                    </label>
                    <div className="w-full px-3 py-2 text-xs rounded-xl bg-emerald-50 border border-emerald-200 font-black text-emerald-600 flex items-center justify-between">
                      <span>+{formatBDT(calculatedProfit)}</span>
                      <span className="text-[10px] text-emerald-700 font-bold">{calculatedMargin}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stock Inventory & Publishing Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Available Stock Units
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formStockCount}
                    onChange={(e) => setFormStockCount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 font-bold text-neutral-900"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2 border border-neutral-200 rounded-xl cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-black focus:ring-black"
                    />
                    <span className="text-xs font-bold text-neutral-800">
                      Published to Resellers
                    </span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:border-black"
                />
              </div>

              {/* Marketing Benefits */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Key Marketing Benefits (1 per line for landing page generation)
                </label>
                <textarea
                  rows={3}
                  value={formBenefits}
                  onChange={(e) => setFormBenefits(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 font-mono text-[11px] focus:outline-none focus:border-black"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  {editingProductId ? 'Save Changes' : 'Publish Product to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
