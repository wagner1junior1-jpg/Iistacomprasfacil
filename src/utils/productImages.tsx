import React from 'react';

// Returns an SVG or styled illustration for any grocery item name or category
export function getProductThumbnail(name: string, categoryId?: string, customImage?: string): React.ReactElement {
  if (customImage) {
    return (
      <img
        src={customImage}
        alt={name}
        className="w-full h-full object-cover rounded-full"
        referrerPolicy="no-referrer"
      />
    );
  }

  const n = (name || '').toLowerCase();

  // Rice / Arroz
  if (/arroz/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-amber-100/80 flex items-center justify-center text-xl shadow-inner border border-amber-200">
        🍚
      </div>
    );
  }

  // Beans / Feijão
  if (/feij[aã]o|lentilha|gr[aã]o/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-amber-900/20 flex items-center justify-center text-xl shadow-inner border border-amber-900/30">
        🫘
      </div>
    );
  }

  // Sugar / Açúcar / Adoçante
  if (/a[çc][uú]car|ado[çc]ante/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-xl shadow-inner border border-slate-300">
        🧊
      </div>
    );
  }

  // Chocolate / Achocolatado / Nescau / Toddy
  if (/achocolatado|chocolate|nescau|toddy|cacau/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-amber-950/20 flex items-center justify-center text-xl shadow-inner border border-amber-800/30">
        🍫
      </div>
    );
  }

  // Milk / Leite / Condensado
  if (/leite condensado/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-amber-50 flex items-center justify-center text-xl shadow-inner border border-amber-200">
        🥫
      </div>
    );
  }
  if (/leite|iogurte|queijo|mussarela|parmes[aã]o|requeij[aã]o/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-blue-50 flex items-center justify-center text-xl shadow-inner border border-blue-200">
        🥛
      </div>
    );
  }

  // Pasta / Macarrão / Molho de tomate
  if (/macarr[aã]o|espaguete|massa|miojo|lasanha/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-yellow-100 flex items-center justify-center text-xl shadow-inner border border-yellow-300">
        🍝
      </div>
    );
  }
  if (/molho|tomate|extrato/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-red-100 flex items-center justify-center text-xl shadow-inner border border-red-200">
        🥫
      </div>
    );
  }

  // Bleach / Água sanitária / Desinfetante / Lisoform / Limpeza
  if (/[aá]gua sanit[aá]ria|cloro/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-sky-100 flex items-center justify-center text-xl shadow-inner border border-sky-300">
        🧴
      </div>
    );
  }
  if (/desinfetante|lisoform|multiuso|limpador|limpeza/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center text-xl shadow-inner border border-indigo-300">
        🧼
      </div>
    );
  }
  if (/amaciante|downy|comfort/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-xl shadow-inner border border-blue-300">
        🧴
      </div>
    );
  }
  if (/sab[aã]o|detergente|lava roupas|omo|ariel|yp[eê]/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-cyan-100 flex items-center justify-center text-xl shadow-inner border border-cyan-300">
        🫧
      </div>
    );
  }

  // Personal Care / Sabonete / Shampoo / Pós barba
  if (/sabonete/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-emerald-100 flex items-center justify-center text-xl shadow-inner border border-emerald-300">
        🧼
      </div>
    );
  }
  if (/shampoo|condicionador|creme|hidratante/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-purple-100 flex items-center justify-center text-xl shadow-inner border border-purple-300">
        🧴
      </div>
    );
  }
  if (/barba|l[aâ]mina|gillette|p[oó]s barba/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center text-xl shadow-inner border border-slate-400">
        🪒
      </div>
    );
  }

  // Trash bags / Saco de lixo
  if (/saco.*lixo|lixo/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-slate-800 text-white flex items-center justify-center text-xl shadow-inner border border-slate-700">
        🗑️
      </div>
    );
  }

  // Flour / Farinha / Mandioca / Trigo
  if (/farinha|mandioca|polvilho|tapioca|fub[aá]|amido/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-amber-50 flex items-center justify-center text-xl shadow-inner border border-amber-200">
        🌾
      </div>
    );
  }

  // Oil / Azeite / Óleo
  if (/azeite|[oó]leo|vinagre/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-yellow-100 flex items-center justify-center text-xl shadow-inner border border-yellow-300">
        🍾
      </div>
    );
  }

  // Coffee / Café / Chá
  if (/caf[eé]|ch[aá]|cappuccino/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-amber-900/30 flex items-center justify-center text-xl shadow-inner border border-amber-900/40">
        ☕
      </div>
    );
  }

  // Bread / Pão / Torrada / Biscoito / Bolacha
  if (/p[aã]o|torrada|biscoito|bolacha|bolo|croissant/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-amber-100 flex items-center justify-center text-xl shadow-inner border border-amber-300">
        🍞
      </div>
    );
  }

  // Meat / Carnes / Frango / Peixe / Ovos
  if (/frango|galinha|peito|coxa|asas/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-red-100 flex items-center justify-center text-xl shadow-inner border border-red-200">
        🍗
      </div>
    );
  }
  if (/carne|bife|picanha|alcatra|mo[ií]da|costela|porco|lingui[çc]a|bacon/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-red-100 flex items-center justify-center text-xl shadow-inner border border-red-300">
        🥩
      </div>
    );
  }
  if (/peixe|salm[aã]o|til[aá]pia|sardinha|atum|camar[aã]o/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-cyan-100 flex items-center justify-center text-xl shadow-inner border border-cyan-200">
        🐟
      </div>
    );
  }
  if (/ovo|ovos/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-amber-100 flex items-center justify-center text-xl shadow-inner border border-amber-200">
        🥚
      </div>
    );
  }

  // Fruits & Vegetables / Hortifruti
  if (/banana/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-yellow-100 flex items-center justify-center text-xl shadow-inner border border-yellow-300">
        🍌
      </div>
    );
  }
  if (/ma[çc][aã]/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-red-100 flex items-center justify-center text-xl shadow-inner border border-red-300">
        🍎
      </div>
    );
  }
  if (/laranja|tangerina|mexerica/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-orange-100 flex items-center justify-center text-xl shadow-inner border border-orange-300">
        🍊
      </div>
    );
  }
  if (/lim[aã]o/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-lime-100 flex items-center justify-center text-xl shadow-inner border border-lime-300">
        🍋
      </div>
    );
  }
  if (/batata/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-amber-100 flex items-center justify-center text-xl shadow-inner border border-amber-200">
        🥔
      </div>
    );
  }
  if (/cebola/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-amber-100 flex items-center justify-center text-xl shadow-inner border border-amber-200">
        🧅
      </div>
    );
  }
  if (/alho/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-xl shadow-inner border border-slate-200">
        🧄
      </div>
    );
  }
  if (/alface|couve|espinafre|folha|salada/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-green-100 flex items-center justify-center text-xl shadow-inner border border-green-300">
        🥬
      </div>
    );
  }
  if (/cenoura/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-orange-100 flex items-center justify-center text-xl shadow-inner border border-orange-300">
        🥕
      </div>
    );
  }

  // Drinks / Bebidas / Refrigerante / Cerveja / Suco / Água
  if (/refrigerante|coca|guaran[aá]|fanta|sprite|pepsi/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-red-100 flex items-center justify-center text-xl shadow-inner border border-red-300">
        🥤
      </div>
    );
  }
  if (/cerveja|heineken|brahma|skol|amstel|chope/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-amber-100 flex items-center justify-center text-xl shadow-inner border border-amber-300">
        🍺
      </div>
    );
  }
  if (/vinho|espumante/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-purple-100 flex items-center justify-center text-xl shadow-inner border border-purple-300">
        🍷
      </div>
    );
  }
  if (/suco/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-orange-100 flex items-center justify-center text-xl shadow-inner border border-orange-200">
        🧃
      </div>
    );
  }
  if (/[aá]gua mineral|[aá]gua/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-sky-100 flex items-center justify-center text-xl shadow-inner border border-sky-300">
        💧
      </div>
    );
  }

  // Hygiene / Toilet paper / Dental
  if (/papel higi[eê]nico|papel toalha/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-xl shadow-inner border border-slate-300">
        🧻
      </div>
    );
  }
  if (/pasta de dente|creme dental|escova/i.test(n)) {
    return (
      <div className="w-full h-full rounded-full bg-teal-100 flex items-center justify-center text-xl shadow-inner border border-teal-300">
        🪥
      </div>
    );
  }

  // Category fallback or default subtle silhouette icon as seen in screenshots
  return (
    <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200/80">
      <svg className="w-5 h-5 opacity-60" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z" />
      </svg>
    </div>
  );
}
