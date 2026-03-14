import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useQuoteStore = create(
  persist(
    (set, get) => ({
      items: [],    // { product, variant, quantity, unit, unit_price, total_price, specs, is_custom, image }
      gst: 18,
      subtotal: 0,
      gstAmount: 0,
      total: 0,

      addItem: (item) => {
        const items = [...get().items, item]
        set({ items })
        get()._recalculate(items)
      },

      removeItem: (index) => {
        const items = get().items.filter((_, i) => i !== index)
        set({ items })
        get()._recalculate(items)
      },

      updateItem: (index, updatedItem) => {
        const items = get().items.map((item, i) => (i === index ? updatedItem : item))
        set({ items })
        get()._recalculate(items)
      },

      clearBasket: () => set({ items: [], subtotal: 0, gstAmount: 0, total: 0 }),

      _recalculate: (items) => {
        const subtotal = items.reduce((sum, item) => sum + Number(item.total_price || 0), 0)
        const gst = get().gst
        const gstAmount = (subtotal * gst) / 100
        const total = subtotal + gstAmount
        set({ subtotal, gstAmount, total })
      },

      setGst: (gst) => {
        set({ gst })
        get()._recalculate(get().items)
      },

      itemCount: () => get().items.length,
    }),
    {
      name: 'sst-quote-basket',
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) state._recalculate(state.items)
      },
    }
  )
)
