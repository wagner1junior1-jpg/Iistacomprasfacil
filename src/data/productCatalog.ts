import { UnitType } from '../types';

export interface CatalogProduct {
  id: string;
  name: string;
  categoryId: string;
  suggestedUnit: UnitType;
  averagePrice?: number;
  keywords: string[];
}

export const PRODUCT_CATALOG: CatalogProduct[] = [
  // ==========================================
  // MERCEARIA & GRÃOS (cat-mercearia)
  // ==========================================
  { id: 'cat-p-1', name: 'Arroz Branco Tipo 1 (5kg)', categoryId: 'cat-mercearia', suggestedUnit: 'pct', averagePrice: 28.50, keywords: ['arroz', 'grãos', 'camil', 'tio joao', '5kg'] },
  { id: 'cat-p-2', name: 'Arroz Integral (1kg)', categoryId: 'cat-mercearia', suggestedUnit: 'pct', averagePrice: 7.90, keywords: ['arroz', 'integral', 'saudavel'] },
  { id: 'cat-p-3', name: 'Arroz Parboilizado (1kg)', categoryId: 'cat-mercearia', suggestedUnit: 'pct', averagePrice: 6.80, keywords: ['arroz', 'parboilizado'] },
  { id: 'cat-p-4', name: 'Feijão Carioca (1kg)', categoryId: 'cat-mercearia', suggestedUnit: 'pct', averagePrice: 7.50, keywords: ['feijao', 'carioca', 'kicaldo', 'camil'] },
  { id: 'cat-p-5', name: 'Feijão Preto (1kg)', categoryId: 'cat-mercearia', suggestedUnit: 'pct', averagePrice: 7.90, keywords: ['feijao', 'preto', 'feijoada'] },
  { id: 'cat-p-6', name: 'Feijão Fradinho (1kg)', categoryId: 'cat-mercearia', suggestedUnit: 'pct', averagePrice: 9.20, keywords: ['feijao', 'fradinho'] },
  { id: 'cat-p-7', name: 'Óleo de Soja (900ml)', categoryId: 'cat-mercearia', suggestedUnit: 'un', averagePrice: 6.90, keywords: ['oleo', 'soja', 'liza', 'soya', 'fritura'] },
  { id: 'cat-p-8', name: 'Azeite de Oliva Extra Virgem (500ml)', categoryId: 'cat-mercearia', suggestedUnit: 'un', averagePrice: 38.00, keywords: ['azeite', 'oliva', 'extra virgem', 'gallo', 'borges'] },
  { id: 'cat-p-9', name: 'Açúcar Refinado (1kg)', categoryId: 'cat-mercearia', suggestedUnit: 'pct', averagePrice: 4.80, keywords: ['açucar', 'refinado', 'uniao', 'doces'] },
  { id: 'cat-p-10', name: 'Açúcar Cristal (5kg)', categoryId: 'cat-mercearia', suggestedUnit: 'pct', averagePrice: 21.00, keywords: ['açucar', 'cristal', '5kg'] },
  { id: 'cat-p-11', name: 'Açúcar Demerara (1kg)', categoryId: 'cat-mercearia', suggestedUnit: 'pct', averagePrice: 8.50, keywords: ['açucar', 'demerara'] },
  { id: 'cat-p-12', name: 'Sal Refinado Iodado (1kg)', categoryId: 'cat-mercearia', suggestedUnit: 'pct', averagePrice: 2.80, keywords: ['sal', 'refinado', 'cisne'] },
  { id: 'cat-p-13', name: 'Sal Grosso para Churrasco (1kg)', categoryId: 'cat-mercearia', suggestedUnit: 'pct', averagePrice: 4.50, keywords: ['sal', 'grosso', 'churrasco'] },
  { id: 'cat-p-14', name: 'Café em Pó Tradicional (500g)', categoryId: 'cat-mercearia', suggestedUnit: 'pct', averagePrice: 19.80, keywords: ['cafe', 'po', 'pilao', 'melitta', '3 corações'] },
  { id: 'cat-p-15', name: 'Café Extraforte (500g)', categoryId: 'cat-mercearia', suggestedUnit: 'pct', averagePrice: 19.80, keywords: ['cafe', 'extraforte'] },
  { id: 'cat-p-16', name: 'Café em Grãos (1kg)', categoryId: 'cat-mercearia', suggestedUnit: 'pct', averagePrice: 55.00, keywords: ['cafe', 'graos', 'expresso'] },
  { id: 'cat-p-17', name: 'Farinha de Trigo Tradicional (1kg)', categoryId: 'cat-mercearia', suggestedUnit: 'pct', averagePrice: 5.20, keywords: ['farinha', 'trigo', 'dona benta', 'bolo', 'pao'] },
  { id: 'cat-p-18', name: 'Farinha de Trigo com Fermento (1kg)', categoryId: 'cat-mercearia', suggestedUnit: 'pct', averagePrice: 6.30, keywords: ['farinha', 'trigo', 'fermento'] },
  { id: 'cat-p-19', name: 'Farinha de Mandioca Torrada (500g)', categoryId: 'cat-mercearia', suggestedUnit: 'pct', averagePrice: 5.50, keywords: ['farinha', 'mandioca', 'farofa'] },
  { id: 'cat-p-20', name: 'Farofa Pronta Temperada (500g)', categoryId: 'cat-mercearia', suggestedUnit: 'pct', averagePrice: 6.90, keywords: ['farofa', 'temperada', 'yoki'] },
  { id: 'cat-p-21', name: 'Fubá Mimoso (1kg)', categoryId: 'cat-mercearia', suggestedUnit: 'pct', averagePrice: 4.20, keywords: ['fuba', 'milho', 'polenta', 'bolo'] },
  { id: 'cat-p-22', name: 'Amido de Milho (500g)', categoryId: 'cat-mercearia', suggestedUnit: 'cx', averagePrice: 7.50, keywords: ['amido', 'milho', 'maizena'] },
  { id: 'cat-p-23', name: 'Macarrão Espaguete nº 8 (500g)', categoryId: 'cat-mercearia', suggestedUnit: 'pct', averagePrice: 4.20, keywords: ['macarrao', 'espaguete', 'massa', 'barilla', 'adria'] },
  { id: 'cat-p-24', name: 'Macarrão Parafuso (500g)', categoryId: 'cat-mercearia', suggestedUnit: 'pct', averagePrice: 4.20, keywords: ['macarrao', 'parafuso', 'massa'] },
  { id: 'cat-p-25', name: 'Macarrão Penne (500g)', categoryId: 'cat-mercearia', suggestedUnit: 'pct', averagePrice: 4.50, keywords: ['macarrao', 'penne'] },
  { id: 'cat-p-26', name: 'Macarrão Instantâneo / Miojo', categoryId: 'cat-mercearia', suggestedUnit: 'pct', averagePrice: 2.30, keywords: ['miojo', 'macarrao instantaneo', 'nissin'] },
  { id: 'cat-p-27', name: 'Molho de Tomate Tradicional Sachê (340g)', categoryId: 'cat-mercearia', suggestedUnit: 'un', averagePrice: 2.80, keywords: ['molho', 'tomate', 'pomarola', 'fugini'] },
  { id: 'cat-p-28', name: 'Extrato de Tomate Lata (340g)', categoryId: 'cat-mercearia', suggestedUnit: 'lata', averagePrice: 4.90, keywords: ['extrato', 'tomate', 'elefante'] },
  { id: 'cat-p-29', name: 'Milho Verde em Conserva Lata (170g)', categoryId: 'cat-mercearia', suggestedUnit: 'lata', averagePrice: 3.80, keywords: ['milho', 'conserva', 'lata'] },
  { id: 'cat-p-30', name: 'Ervilha em Conserva Lata (170g)', categoryId: 'cat-mercearia', suggestedUnit: 'lata', averagePrice: 3.80, keywords: ['ervilha', 'conserva', 'lata'] },
  { id: 'cat-p-31', name: 'Dueto Milho e Ervilha Lata', categoryId: 'cat-mercearia', suggestedUnit: 'lata', averagePrice: 4.20, keywords: ['dueto', 'milho', 'ervilha'] },
  { id: 'cat-p-32', name: 'Atum Ralado em Óleo Lata (170g)', categoryId: 'cat-mercearia', suggestedUnit: 'lata', averagePrice: 7.90, keywords: ['atum', 'ralado', 'gomes da costa', 'pescador'] },
  { id: 'cat-p-33', name: 'Atum Sólido ao Natural Lata (170g)', categoryId: 'cat-mercearia', suggestedUnit: 'lata', averagePrice: 11.50, keywords: ['atum', 'solido'] },
  { id: 'cat-p-34', name: 'Sardinha em Óleo Lata (125g)', categoryId: 'cat-mercearia', suggestedUnit: 'lata', averagePrice: 5.20, keywords: ['sardinha', 'lata', 'oleo', 'coqueiro'] },
  { id: 'cat-p-35', name: 'Maionese Pote (500g)', categoryId: 'cat-mercearia', suggestedUnit: 'un', averagePrice: 8.90, keywords: ['maionese', 'hellmanns', 'heinz'] },
  { id: 'cat-p-36', name: 'Ketchup Tradicional (400g)', categoryId: 'cat-mercearia', suggestedUnit: 'un', averagePrice: 9.50, keywords: ['ketchup', 'heinz', 'hellmanns'] },
  { id: 'cat-p-37', name: 'Mostarda Amarela (200g)', categoryId: 'cat-mercearia', suggestedUnit: 'un', averagePrice: 5.80, keywords: ['mostarda'] },
  { id: 'cat-p-38', name: 'Vinagre de Álcool (750ml)', categoryId: 'cat-mercearia', suggestedUnit: 'un', averagePrice: 2.90, keywords: ['vinagre', 'alcool', 'salada'] },
  { id: 'cat-p-39', name: 'Vinagre de Maçã (750ml)', categoryId: 'cat-mercearia', suggestedUnit: 'un', averagePrice: 4.90, keywords: ['vinagre', 'maçã'] },
  { id: 'cat-p-40', name: 'Azeitona Verde sem Caroço (200g)', categoryId: 'cat-mercearia', suggestedUnit: 'un', averagePrice: 7.90, keywords: ['azeitona', 'verde', 'conserva'] },
  { id: 'cat-p-41', name: 'Palmito Picado em Conserva (300g)', categoryId: 'cat-mercearia', suggestedUnit: 'un', averagePrice: 18.00, keywords: ['palmito', 'conserva'] },
  { id: 'cat-p-42', name: 'Fermento Químico em Pó (100g)', categoryId: 'cat-mercearia', suggestedUnit: 'un', averagePrice: 4.80, keywords: ['fermento', 'quimico', 'royal', 'bolo'] },
  { id: 'cat-p-43', name: 'Fermento Biológico Seco (10g)', categoryId: 'cat-mercearia', suggestedUnit: 'pct', averagePrice: 2.50, keywords: ['fermento', 'biologico', 'pao', 'pizza'] },

  // ==========================================
  // HORTIFRUTI & FEIRA (cat-hortifruti)
  // ==========================================
  { id: 'cat-p-44', name: 'Banana Prata (kg)', categoryId: 'cat-hortifruti', suggestedUnit: 'kg', averagePrice: 6.99, keywords: ['banana', 'prata', 'fruta'] },
  { id: 'cat-p-45', name: 'Banana Nanica (kg)', categoryId: 'cat-hortifruti', suggestedUnit: 'kg', averagePrice: 5.99, keywords: ['banana', 'nanica', 'fruta'] },
  { id: 'cat-p-46', name: 'Maçã Gala (kg)', categoryId: 'cat-hortifruti', suggestedUnit: 'kg', averagePrice: 10.90, keywords: ['maçã', 'gala', 'fruta'] },
  { id: 'cat-p-47', name: 'Maçã Fuji (kg)', categoryId: 'cat-hortifruti', suggestedUnit: 'kg', averagePrice: 11.50, keywords: ['maçã', 'fuji', 'fruta'] },
  { id: 'cat-p-48', name: 'Tomate Italiano (kg)', categoryId: 'cat-hortifruti', suggestedUnit: 'kg', averagePrice: 7.99, keywords: ['tomate', 'italiano', 'salada'] },
  { id: 'cat-p-49', name: 'Tomate Débora / Carmem (kg)', categoryId: 'cat-hortifruti', suggestedUnit: 'kg', averagePrice: 6.99, keywords: ['tomate', 'debora', 'salada'] },
  { id: 'cat-p-50', name: 'Cebola Nacional (kg)', categoryId: 'cat-hortifruti', suggestedUnit: 'kg', averagePrice: 5.80, keywords: ['cebola', 'tempero'] },
  { id: 'cat-p-51', name: 'Alho Roxo (kg ou rede)', categoryId: 'cat-hortifruti', suggestedUnit: 'kg', averagePrice: 34.00, keywords: ['alho', 'tempero'] },
  { id: 'cat-p-52', name: 'Batata Inglesa / Lavada (kg)', categoryId: 'cat-hortifruti', suggestedUnit: 'kg', averagePrice: 5.99, keywords: ['batata', 'inglesa', 'legume'] },
  { id: 'cat-p-53', name: 'Batata Doce (kg)', categoryId: 'cat-hortifruti', suggestedUnit: 'kg', averagePrice: 4.80, keywords: ['batata doce', 'fit'] },
  { id: 'cat-p-54', name: 'Cenoura (kg)', categoryId: 'cat-hortifruti', suggestedUnit: 'kg', averagePrice: 5.50, keywords: ['cenoura', 'legume'] },
  { id: 'cat-p-55', name: 'Alface Crespa (maço)', categoryId: 'cat-hortifruti', suggestedUnit: 'un', averagePrice: 3.50, keywords: ['alface', 'crespa', 'salada', 'folha'] },
  { id: 'cat-p-56', name: 'Alface Americana (un)', categoryId: 'cat-hortifruti', suggestedUnit: 'un', averagePrice: 4.50, keywords: ['alface', 'americana', 'salada'] },
  { id: 'cat-p-57', name: 'Laranja Pera (kg)', categoryId: 'cat-hortifruti', suggestedUnit: 'kg', averagePrice: 4.99, keywords: ['laranja', 'pera', 'suco', 'fruta'] },
  { id: 'cat-p-58', name: 'Limão Taiti (kg)', categoryId: 'cat-hortifruti', suggestedUnit: 'kg', averagePrice: 4.50, keywords: ['limao', 'taiti', 'tempero', 'suco'] },
  { id: 'cat-p-59', name: 'Ovos Brancos Granjeiros (Dúzia)', categoryId: 'cat-hortifruti', suggestedUnit: 'dz', averagePrice: 11.90, keywords: ['ovo', 'ovos', 'duzia', 'proteina'] },
  { id: 'cat-p-60', name: 'Ovos Vermelhos / Caipira (Dúzia)', categoryId: 'cat-hortifruti', suggestedUnit: 'dz', averagePrice: 14.50, keywords: ['ovo', 'vermelho', 'caipira'] },
  { id: 'cat-p-61', name: 'Cartela de Ovos (30 unidades)', categoryId: 'cat-hortifruti', suggestedUnit: 'un', averagePrice: 23.90, keywords: ['ovos', 'cartela', '30'] },
  { id: 'cat-p-62', name: 'Mamão Papaia (un)', categoryId: 'cat-hortifruti', suggestedUnit: 'un', averagePrice: 4.80, keywords: ['mamao', 'papaia', 'fruta'] },
  { id: 'cat-p-63', name: 'Melancia Inteira ou Fatia (kg)', categoryId: 'cat-hortifruti', suggestedUnit: 'kg', averagePrice: 2.99, keywords: ['melancia', 'fruta'] },
  { id: 'cat-p-64', name: 'Melão Amarelo (kg)', categoryId: 'cat-hortifruti', suggestedUnit: 'kg', averagePrice: 6.50, keywords: ['melao', 'amarelo', 'fruta'] },
  { id: 'cat-p-65', name: 'Abacaxi Pérola (un)', categoryId: 'cat-hortifruti', suggestedUnit: 'un', averagePrice: 6.99, keywords: ['abacaxi', 'perola', 'fruta'] },
  { id: 'cat-p-66', name: 'Manga Tommy / Palmer (kg)', categoryId: 'cat-hortifruti', suggestedUnit: 'kg', averagePrice: 7.50, keywords: ['manga', 'palmer', 'tommy', 'fruta'] },
  { id: 'cat-p-67', name: 'Uva Sem Semente (bandeja 500g)', categoryId: 'cat-hortifruti', suggestedUnit: 'pct', averagePrice: 9.90, keywords: ['uva', 'sem semente', 'fruta'] },
  { id: 'cat-p-68', name: 'Morango Fresco (bandeja 250g)', categoryId: 'cat-hortifruti', suggestedUnit: 'pct', averagePrice: 7.90, keywords: ['morango', 'fruta'] },
  { id: 'cat-p-69', name: 'Pimentão Verde (kg)', categoryId: 'cat-hortifruti', suggestedUnit: 'kg', averagePrice: 8.50, keywords: ['pimentao', 'verde', 'tempero'] },
  { id: 'cat-p-70', name: 'Chuchu (kg)', categoryId: 'cat-hortifruti', suggestedUnit: 'kg', averagePrice: 3.80, keywords: ['chuchu', 'legume'] },
  { id: 'cat-p-71', name: 'Abobrinha Italiana (kg)', categoryId: 'cat-hortifruti', suggestedUnit: 'kg', averagePrice: 4.90, keywords: ['abobrinha', 'italiana', 'legume'] },
  { id: 'cat-p-72', name: 'Couve Manteiga (maço)', categoryId: 'cat-hortifruti', suggestedUnit: 'un', averagePrice: 3.50, keywords: ['couve', 'manteiga', 'folha', 'suco verde'] },
  { id: 'cat-p-73', name: 'Cheiro Verde / Coentro e Cebolinha', categoryId: 'cat-hortifruti', suggestedUnit: 'un', averagePrice: 2.80, keywords: ['cheiro verde', 'cebolinha', 'coentro', 'salsa'] },
  { id: 'cat-p-74', name: 'Mandioca / Aipim Descascado (kg)', categoryId: 'cat-hortifruti', suggestedUnit: 'kg', averagePrice: 6.50, keywords: ['mandioca', 'aipim', 'macaxeira'] },
  { id: 'cat-p-75', name: 'Pepino Japonês (kg)', categoryId: 'cat-hortifruti', suggestedUnit: 'kg', averagePrice: 5.90, keywords: ['pepino', 'japones', 'salada'] },

  // ==========================================
  // CARNES, AVES & PEIXES (cat-carnes)
  // ==========================================
  { id: 'cat-p-76', name: 'Carne Moída Patinho (kg)', categoryId: 'cat-carnes', suggestedUnit: 'kg', averagePrice: 38.90, keywords: ['carne moida', 'patinho', 'bovina'] },
  { id: 'cat-p-77', name: 'Carne Moída Acém (kg)', categoryId: 'cat-carnes', suggestedUnit: 'kg', averagePrice: 29.90, keywords: ['carne moida', 'acem'] },
  { id: 'cat-p-78', name: 'Alcatra Bovina Bife (kg)', categoryId: 'cat-carnes', suggestedUnit: 'kg', averagePrice: 44.90, keywords: ['alcatra', 'bife', 'churrasco'] },
  { id: 'cat-p-79', name: 'Contrafilé Bovino (kg)', categoryId: 'cat-carnes', suggestedUnit: 'kg', averagePrice: 49.90, keywords: ['contrafile', 'bife', 'churrasco'] },
  { id: 'cat-p-80', name: 'Picanha Bovina (kg)', categoryId: 'cat-carnes', suggestedUnit: 'kg', averagePrice: 75.00, keywords: ['picanha', 'churrasco'] },
  { id: 'cat-p-81', name: 'Coxão Mole Bife (kg)', categoryId: 'cat-carnes', suggestedUnit: 'kg', averagePrice: 36.90, keywords: ['coxao mole', 'bife'] },
  { id: 'cat-p-82', name: 'Músculo Bovino (kg)', categoryId: 'cat-carnes', suggestedUnit: 'kg', averagePrice: 28.90, keywords: ['musculo', 'sopa', 'cozido'] },
  { id: 'cat-p-83', name: 'Costela Bovina (kg)', categoryId: 'cat-carnes', suggestedUnit: 'kg', averagePrice: 26.90, keywords: ['costela', 'churrasco', 'bafo'] },
  { id: 'cat-p-84', name: 'Peito de Frango Filé (kg)', categoryId: 'cat-carnes', suggestedUnit: 'kg', averagePrice: 19.90, keywords: ['frango', 'peito', 'file', 'sadia', 'seara'] },
  { id: 'cat-p-85', name: 'Coxa e Sobrecoxa de Frango (kg)', categoryId: 'cat-carnes', suggestedUnit: 'kg', averagePrice: 11.90, keywords: ['frango', 'coxa', 'sobrecoxa'] },
  { id: 'cat-p-86', name: 'Frango Inteiro Congelado (kg)', categoryId: 'cat-carnes', suggestedUnit: 'kg', averagePrice: 9.90, keywords: ['frango inteiro', 'assar'] },
  { id: 'cat-p-87', name: 'Asa de Frango / Meio da Asa (kg)', categoryId: 'cat-carnes', suggestedUnit: 'kg', averagePrice: 17.50, keywords: ['asa', 'tulipa', 'frango', 'churrasco'] },
  { id: 'cat-p-88', name: 'Linguiça Toscana para Churrasco (kg)', categoryId: 'cat-carnes', suggestedUnit: 'kg', averagePrice: 18.90, keywords: ['linguiça', 'toscana', 'churrasco', 'aurora', 'perdigao'] },
  { id: 'cat-p-89', name: 'Linguiça Calabresa Defumada (kg)', categoryId: 'cat-carnes', suggestedUnit: 'kg', averagePrice: 26.90, keywords: ['linguiça', 'calabresa', 'defumada', 'pizza'] },
  { id: 'cat-p-90', name: 'Bacon em Pedaço ou Manta (kg)', categoryId: 'cat-carnes', suggestedUnit: 'kg', averagePrice: 32.00, keywords: ['bacon', 'defumado'] },
  { id: 'cat-p-91', name: 'Bacon Fatiado (250g)', categoryId: 'cat-carnes', suggestedUnit: 'pct', averagePrice: 12.90, keywords: ['bacon', 'fatiado'] },
  { id: 'cat-p-92', name: 'Bisteca Suína (kg)', categoryId: 'cat-carnes', suggestedUnit: 'kg', averagePrice: 17.90, keywords: ['bisteca', 'porco', 'suina'] },
  { id: 'cat-p-93', name: 'Costelinha Suína (kg)', categoryId: 'cat-carnes', suggestedUnit: 'kg', averagePrice: 25.90, keywords: ['costela', 'suina', 'porco', 'barbecue'] },
  { id: 'cat-p-94', name: 'Filé de Tilápia Congelado (500g ou 1kg)', categoryId: 'cat-carnes', suggestedUnit: 'pct', averagePrice: 29.90, keywords: ['peixe', 'tilapia', 'file'] },
  { id: 'cat-p-95', name: 'Salsicha Hot Dog (kg)', categoryId: 'cat-carnes', suggestedUnit: 'kg', averagePrice: 11.50, keywords: ['salsicha', 'hot dog', 'perdigao'] },

  // ==========================================
  // LATICÍNIOS & FRIOS (cat-laticinios)
  // ==========================================
  { id: 'cat-p-96', name: 'Leite Integral UHT (1L)', categoryId: 'cat-laticinios', suggestedUnit: 'cx', averagePrice: 5.20, keywords: ['leite', 'integral', 'italac', 'piracanjuba', 'parmalat'] },
  { id: 'cat-p-97', name: 'Leite Desnatado UHT (1L)', categoryId: 'cat-laticinios', suggestedUnit: 'cx', averagePrice: 5.20, keywords: ['leite', 'desnatado'] },
  { id: 'cat-p-98', name: 'Leite Semidesnatado UHT (1L)', categoryId: 'cat-laticinios', suggestedUnit: 'cx', averagePrice: 5.20, keywords: ['leite', 'semidesnatado'] },
  { id: 'cat-p-99', name: 'Leite Zero Lactose (1L)', categoryId: 'cat-laticinios', suggestedUnit: 'cx', averagePrice: 6.50, keywords: ['leite', 'zero lactose'] },
  { id: 'cat-p-100', name: 'Queijo Mussarela Fatiado (kg ou 200g)', categoryId: 'cat-laticinios', suggestedUnit: 'kg', averagePrice: 42.00, keywords: ['queijo', 'mussarela', 'fatiado'] },
  { id: 'cat-p-101', name: 'Presunto Cozido Fatiado (kg ou 200g)', categoryId: 'cat-laticinios', suggestedUnit: 'kg', averagePrice: 29.90, keywords: ['presunto', 'cozido', 'sadia', 'seara'] },
  { id: 'cat-p-102', name: 'Peito de Peru Defumado Fatiado', categoryId: 'cat-laticinios', suggestedUnit: 'pct', averagePrice: 12.50, keywords: ['peito de peru', 'light'] },
  { id: 'cat-p-103', name: 'Manteiga com Sal Pote (200g)', categoryId: 'cat-laticinios', suggestedUnit: 'un', averagePrice: 11.90, keywords: ['manteiga', 'sal', 'aviacao', 'elegê'] },
  { id: 'cat-p-104', name: 'Margarina com Sal Pote (500g)', categoryId: 'cat-laticinios', suggestedUnit: 'un', averagePrice: 7.50, keywords: ['margarina', 'qualy', 'delicia'] },
  { id: 'cat-p-105', name: 'Requeijão Cremoso Tradicional (200g)', categoryId: 'cat-laticinios', suggestedUnit: 'un', averagePrice: 8.90, keywords: ['requeijao', 'cremoso', 'vigor', 'danone', 'itambe'] },
  { id: 'cat-p-106', name: 'Creme de Leite TP (200g)', categoryId: 'cat-laticinios', suggestedUnit: 'cx', averagePrice: 3.40, keywords: ['creme de leite', 'nestle', 'mocoquinha'] },
  { id: 'cat-p-107', name: 'Leite Condensado TP / Lata (395g)', categoryId: 'cat-laticinios', suggestedUnit: 'cx', averagePrice: 6.20, keywords: ['leite condensado', 'moça', 'pudim', 'brigadeiro'] },
  { id: 'cat-p-108', name: 'Queijo Prato Fatiado (200g)', categoryId: 'cat-laticinios', suggestedUnit: 'pct', averagePrice: 11.50, keywords: ['queijo', 'prato', 'lanche'] },
  { id: 'cat-p-109', name: 'Queijo Parmesão Ralado (50g)', categoryId: 'cat-laticinios', suggestedUnit: 'pct', averagePrice: 4.90, keywords: ['queijo ralado', 'parmesao', 'massa'] },
  { id: 'cat-p-110', name: 'Iogurte Natural Integral (170g)', categoryId: 'cat-laticinios', suggestedUnit: 'un', averagePrice: 3.80, keywords: ['iogurte', 'natural', 'nestle'] },
  { id: 'cat-p-111', name: 'Iogurte de Frutas Garrafa (900g)', categoryId: 'cat-laticinios', suggestedUnit: 'un', averagePrice: 10.90, keywords: ['iogurte', 'morango', 'garrafa'] },
  { id: 'cat-p-112', name: 'Bebida Láctea com Chocolate (1L)', categoryId: 'cat-laticinios', suggestedUnit: 'cx', averagePrice: 6.90, keywords: ['toddy', 'toddynho', 'achocolatado', 'chamyto'] },

  // ==========================================
  // BEBIDAS (cat-bebidas)
  // ==========================================
  { id: 'cat-p-113', name: 'Água Mineral sem Gás (1.5L)', categoryId: 'cat-bebidas', suggestedUnit: 'un', averagePrice: 2.50, keywords: ['agua', 'mineral', 'sem gas', 'bonafont', 'crystal'] },
  { id: 'cat-p-114', name: 'Água Mineral com Gás (500ml)', categoryId: 'cat-bebidas', suggestedUnit: 'un', averagePrice: 2.20, keywords: ['agua', 'com gas'] },
  { id: 'cat-p-115', name: 'Galão de Água Mineral (20L)', categoryId: 'cat-bebidas', suggestedUnit: 'un', averagePrice: 14.00, keywords: ['agua', 'galao', '20l'] },
  { id: 'cat-p-116', name: 'Refrigerante Coca-Cola Original (2L)', categoryId: 'cat-bebidas', suggestedUnit: 'un', averagePrice: 9.90, keywords: ['refrigerante', 'coca cola', 'refri', '2l'] },
  { id: 'cat-p-117', name: 'Refrigerante Coca-Cola Zero (2L)', categoryId: 'cat-bebidas', suggestedUnit: 'un', averagePrice: 9.90, keywords: ['coca zero', 'sem açucar'] },
  { id: 'cat-p-118', name: 'Refrigerante Guaraná Antarctica (2L)', categoryId: 'cat-bebidas', suggestedUnit: 'un', averagePrice: 8.50, keywords: ['guarana', 'antarctica', 'refri'] },
  { id: 'cat-p-119', name: 'Suco de Uva Integral Garrafa (1.5L)', categoryId: 'cat-bebidas', suggestedUnit: 'un', averagePrice: 15.90, keywords: ['suco', 'uva', 'integral', 'aurora'] },
  { id: 'cat-p-120', name: 'Suco Concentrado Garrafa (500ml)', categoryId: 'cat-bebidas', suggestedUnit: 'un', averagePrice: 6.50, keywords: ['suco', 'maracuja', 'caju', 'maguary'] },
  { id: 'cat-p-121', name: 'Suco de Caixa Néctar (1L)', categoryId: 'cat-bebidas', suggestedUnit: 'cx', averagePrice: 5.90, keywords: ['suco', 'caixa', 'del valle', 'marata'] },
  { id: 'cat-p-122', name: 'Cerveja Pilsen Lata (350ml)', categoryId: 'cat-bebidas', suggestedUnit: 'lata', averagePrice: 3.50, keywords: ['cerveja', 'skol', 'brahma', 'amstel', 'heineken'] },
  { id: 'cat-p-123', name: 'Cerveja Puro Malte Lata (350ml)', categoryId: 'cat-bebidas', suggestedUnit: 'lata', averagePrice: 4.20, keywords: ['cerveja', 'heineken', 'spaten', 'amstel'] },
  { id: 'cat-p-124', name: 'Cerveja Fardo com 12 latas', categoryId: 'cat-bebidas', suggestedUnit: 'fd', averagePrice: 42.00, keywords: ['fardo', 'cerveja', 'pack'] },
  { id: 'cat-p-125', name: 'Vinho Tinto Seco Garrafa (750ml)', categoryId: 'cat-bebidas', suggestedUnit: 'un', averagePrice: 28.00, keywords: ['vinho', 'tinto', 'cabernet', 'merlot'] },
  { id: 'cat-p-126', name: 'Água de Coco (1L)', categoryId: 'cat-bebidas', suggestedUnit: 'cx', averagePrice: 9.90, keywords: ['agua de coco', 'kero coco'] },
  { id: 'cat-p-127', name: 'Energético Lata (473ml)', categoryId: 'cat-bebidas', suggestedUnit: 'lata', averagePrice: 9.50, keywords: ['energetico', 'monster', 'red bull'] },
  { id: 'cat-p-128', name: 'Chá Mate Solúvel / Tostado (250g)', categoryId: 'cat-bebidas', suggestedUnit: 'pct', averagePrice: 7.90, keywords: ['cha', 'mate leao'] },

  // ==========================================
  // LIMPEZA DO LAR (cat-limpeza)
  // ==========================================
  { id: 'cat-p-129', name: 'Sabão em Pó para Roupas (1kg ou 1.6kg)', categoryId: 'cat-limpeza', suggestedUnit: 'cx', averagePrice: 16.90, keywords: ['sabao em po', 'omo', 'brilhante', 'roupa'] },
  { id: 'cat-p-130', name: 'Lava Roupas Líquido (3L)', categoryId: 'cat-limpeza', suggestedUnit: 'un', averagePrice: 36.90, keywords: ['sabao liquido', 'omo liquido', 'roupa'] },
  { id: 'cat-p-131', name: 'Amaciante de Roupas Concentrado (1L)', categoryId: 'cat-limpeza', suggestedUnit: 'un', averagePrice: 18.90, keywords: ['amaciante', 'concentrado', 'downy', 'comfort'] },
  { id: 'cat-p-132', name: 'Amaciante Tradicional (2L)', categoryId: 'cat-limpeza', suggestedUnit: 'un', averagePrice: 10.90, keywords: ['amaciante', 'ypê', 'baby soft'] },
  { id: 'cat-p-133', name: 'Detergente Líquido Lava-Louças (500ml)', categoryId: 'cat-limpeza', suggestedUnit: 'un', averagePrice: 2.60, keywords: ['detergente', 'ype', 'limpol', 'louça'] },
  { id: 'cat-p-134', name: 'Desinfetante Perfumado (2L)', categoryId: 'cat-limpeza', suggestedUnit: 'un', averagePrice: 8.90, keywords: ['desinfetante', 'pinho sol', 'ype', 'chao'] },
  { id: 'cat-p-135', name: 'Água Sanitária (2L)', categoryId: 'cat-limpeza', suggestedUnit: 'un', averagePrice: 5.90, keywords: ['agua sanitaria', 'cloro', 'candida', 'dragao'] },
  { id: 'cat-p-136', name: 'Limpador Multiuso (500ml)', categoryId: 'cat-limpeza', suggestedUnit: 'un', averagePrice: 5.20, keywords: ['multiuso', 'veja'] },
  { id: 'cat-p-137', name: 'Esponja de Cozinha Dupla Face (pct c/ 3)', categoryId: 'cat-limpeza', suggestedUnit: 'pct', averagePrice: 5.50, keywords: ['esponja', 'pia', 'scotch brite'] },
  { id: 'cat-p-138', name: 'Lã de Aço / Palha de Aço (pct c/ 8)', categoryId: 'cat-limpeza', suggestedUnit: 'pct', averagePrice: 3.20, keywords: ['palha de aço', 'bombril', 'assolan'] },
  { id: 'cat-p-139', name: 'Sacos de Lixo 50 Litros (pct c/ 30)', categoryId: 'cat-limpeza', suggestedUnit: 'pct', averagePrice: 14.50, keywords: ['saco de lixo', '50l', 'lixeira'] },
  { id: 'cat-p-140', name: 'Sacos de Lixo 100 Litros (pct c/ 10)', categoryId: 'cat-limpeza', suggestedUnit: 'pct', averagePrice: 12.90, keywords: ['saco de lixo', '100l'] },
  { id: 'cat-p-141', name: 'Papel Toalha de Cozinha (pct c/ 2 rolos)', categoryId: 'cat-limpeza', suggestedUnit: 'pct', averagePrice: 6.50, keywords: ['papel toalha', 'rolo', 'snob'] },
  { id: 'cat-p-142', name: 'Alvejante sem Cloro para Roupas (1.5L)', categoryId: 'cat-limpeza', suggestedUnit: 'un', averagePrice: 15.90, keywords: ['alvejante', 'vanish'] },
  { id: 'cat-p-143', name: 'Lustra Móveis (200ml)', categoryId: 'cat-limpeza', suggestedUnit: 'un', averagePrice: 7.90, keywords: ['lustra moveis', 'poliflor'] },
  { id: 'cat-p-144', name: 'Desengordurante de Cozinha Refil/Squeeze', categoryId: 'cat-limpeza', suggestedUnit: 'un', averagePrice: 9.80, keywords: ['desengordurante', 'fogao', 'veja'] },

  // ==========================================
  // HIGIENE & CUIDADOS PESSOAIS (cat-higiene)
  // ==========================================
  { id: 'cat-p-145', name: 'Papel Higiênico Folha Dupla (pct c/ 12)', categoryId: 'cat-higiene', suggestedUnit: 'pct', averagePrice: 19.90, keywords: ['papel higienico', 'neve', 'personal', 'folha dupla'] },
  { id: 'cat-p-146', name: 'Sabonete em Barra (90g)', categoryId: 'cat-higiene', suggestedUnit: 'un', averagePrice: 2.80, keywords: ['sabonete', 'barra', 'dove', 'palmolive', 'lux'] },
  { id: 'cat-p-147', name: 'Sabonete Líquido Refil (250ml)', categoryId: 'cat-higiene', suggestedUnit: 'un', averagePrice: 8.50, keywords: ['sabonete liquido', 'maos'] },
  { id: 'cat-p-148', name: 'Creme Dental / Pasta de Dente (90g)', categoryId: 'cat-higiene', suggestedUnit: 'un', averagePrice: 4.90, keywords: ['pasta de dente', 'creme dental', 'colgate', 'sorriso'] },
  { id: 'cat-p-149', name: 'Escova de Dentes Macia', categoryId: 'cat-higiene', suggestedUnit: 'un', averagePrice: 7.90, keywords: ['escova dental', 'colgate', 'oral b'] },
  { id: 'cat-p-150', name: 'Fio Dental (50m)', categoryId: 'cat-higiene', suggestedUnit: 'un', averagePrice: 8.90, keywords: ['fio dental', 'dentes'] },
  { id: 'cat-p-151', name: 'Enxaguante Bucal Antisséptico (500ml)', categoryId: 'cat-higiene', suggestedUnit: 'un', averagePrice: 19.90, keywords: ['enxaguante bucal', 'listerine', 'colgate'] },
  { id: 'cat-p-152', name: 'Shampoo (350ml / 400ml)', categoryId: 'cat-higiene', suggestedUnit: 'un', averagePrice: 14.90, keywords: ['shampoo', 'cabelo', 'pantene', 'head shoulders', 'seda'] },
  { id: 'cat-p-153', name: 'Condicionador (350ml / 400ml)', categoryId: 'cat-higiene', suggestedUnit: 'un', averagePrice: 16.90, keywords: ['condicionador', 'cabelo'] },
  { id: 'cat-p-154', name: 'Desodorante Aerossol Antitranspirante (150ml)', categoryId: 'cat-higiene', suggestedUnit: 'un', averagePrice: 14.50, keywords: ['desodorante', 'aerossol', 'rexona', 'nivea', 'dove'] },
  { id: 'cat-p-155', name: 'Desodorante Roll-on (50ml)', categoryId: 'cat-higiene', suggestedUnit: 'un', averagePrice: 8.90, keywords: ['desodorante', 'rollon'] },
  { id: 'cat-p-156', name: 'Hastes Flexíveis / Cotonetes (pct c/ 75)', categoryId: 'cat-higiene', suggestedUnit: 'cx', averagePrice: 4.50, keywords: ['cotonete', 'hastes flexiveis', 'johnson'] },
  { id: 'cat-p-157', name: 'Algodão em Disco ou Rolo (100g)', categoryId: 'cat-higiene', suggestedUnit: 'pct', averagePrice: 6.90, keywords: ['algodao', 'disco'] },
  { id: 'cat-p-158', name: 'Aparelho de Barbear Descartável (pct c/ 2)', categoryId: 'cat-higiene', suggestedUnit: 'pct', averagePrice: 8.90, keywords: ['gilete', 'aparelho barbear', 'prestobarba'] },
  { id: 'cat-p-159', name: 'Absorvente Higiênico com Abas (pct c/ 8)', categoryId: 'cat-higiene', suggestedUnit: 'pct', averagePrice: 5.90, keywords: ['absorvente', 'sempre livre', 'intimus'] },
  { id: 'cat-p-160', name: 'Lenços Umedecidos (pct c/ 50)', categoryId: 'cat-higiene', suggestedUnit: 'pct', averagePrice: 9.90, keywords: ['lenço umedecido', 'bebe'] },

  // ==========================================
  // PADARIA & MATINAIS (cat-padaria)
  // ==========================================
  { id: 'cat-p-161', name: 'Pão Francês Tradicional (kg)', categoryId: 'cat-padaria', suggestedUnit: 'kg', averagePrice: 16.90, keywords: ['pao frances', 'padaria', 'pao de sal'] },
  { id: 'cat-p-162', name: 'Pão de Forma Tradicional (500g)', categoryId: 'cat-padaria', suggestedUnit: 'pct', averagePrice: 7.90, keywords: ['pao de forma', 'pullman', 'wickbold'] },
  { id: 'cat-p-163', name: 'Pão de Forma Integral (500g)', categoryId: 'cat-padaria', suggestedUnit: 'pct', averagePrice: 9.50, keywords: ['pao integral', 'fibras'] },
  { id: 'cat-p-164', name: 'Torrada Salgada Tradicional (140g)', categoryId: 'cat-padaria', suggestedUnit: 'pct', averagePrice: 4.90, keywords: ['torrada', 'bauducco', 'marilan'] },
  { id: 'cat-p-165', name: 'Biscoito Cream Cracker (400g)', categoryId: 'cat-padaria', suggestedUnit: 'pct', averagePrice: 5.20, keywords: ['biscoito', 'cream cracker', 'agua e sal'] },
  { id: 'cat-p-166', name: 'Biscoito Recheado de Chocolate (130g)', categoryId: 'cat-padaria', suggestedUnit: 'pct', averagePrice: 3.20, keywords: ['biscoito recheado', 'trakinas', 'passatempo', 'oreo'] },
  { id: 'cat-p-167', name: 'Biscoito Maisena Tradicional (400g)', categoryId: 'cat-padaria', suggestedUnit: 'pct', averagePrice: 5.80, keywords: ['biscoito maisena', 'marilan'] },
  { id: 'cat-p-168', name: 'Achocolatado em Pó Lata/Sachê (400g)', categoryId: 'cat-padaria', suggestedUnit: 'un', averagePrice: 8.90, keywords: ['achocolatado', 'nescau', 'toddy', 'chocolate'] },
  { id: 'cat-p-169', name: 'Cereal Matinal de Milho / Sucrilhos (300g)', categoryId: 'cat-padaria', suggestedUnit: 'cx', averagePrice: 11.50, keywords: ['sucrilhos', 'cereal', 'kelloggs'] },
  { id: 'cat-p-170', name: 'Aveia em Flocos Finos (170g ou 400g)', categoryId: 'cat-padaria', suggestedUnit: 'cx', averagePrice: 6.50, keywords: ['aveia', 'quaker', 'flocos'] },
  { id: 'cat-p-171', name: 'Granola Tradicional com Castanhas (1kg)', categoryId: 'cat-padaria', suggestedUnit: 'pct', averagePrice: 22.00, keywords: ['granola', 'cereais', 'iogurte'] },
  { id: 'cat-p-172', name: 'Bolo Pronto de Chocolate/Cenoura', categoryId: 'cat-padaria', suggestedUnit: 'un', averagePrice: 9.90, keywords: ['bolo', 'pullman', 'casa suiça'] },

  // ==========================================
  // CONGELADOS (cat-congelados)
  // ==========================================
  { id: 'cat-p-173', name: 'Lasanha Bolonhesa Congelada (600g)', categoryId: 'cat-congelados', suggestedUnit: 'cx', averagePrice: 13.90, keywords: ['lasanha', 'sadia', 'seara', 'bolonhesa'] },
  { id: 'cat-p-174', name: 'Pizza Congelada de Calabresa / Mussarela', categoryId: 'cat-congelados', suggestedUnit: 'cx', averagePrice: 14.90, keywords: ['pizza', 'sadia', 'seara'] },
  { id: 'cat-p-175', name: 'Hambúrguer Bovino Congelado (caixa c/ 12)', categoryId: 'cat-congelados', suggestedUnit: 'cx', averagePrice: 21.00, keywords: ['hamburguer', 'sadia', 'seara', 'friboi'] },
  { id: 'cat-p-176', name: 'Nuggets / Empanados de Frango (300g)', categoryId: 'cat-congelados', suggestedUnit: 'cx', averagePrice: 9.90, keywords: ['nuggets', 'empanado', 'frango'] },
  { id: 'cat-p-177', name: 'Batata Palito Congelada (1kg)', categoryId: 'cat-congelados', suggestedUnit: 'pct', averagePrice: 16.90, keywords: ['batata congelada', 'batata frita', 'airfryer'] },
  { id: 'cat-p-178', name: 'Pão de Queijo Congelado Tradicional (1kg)', categoryId: 'cat-congelados', suggestedUnit: 'pct', averagePrice: 18.90, keywords: ['pao de queijo', 'forno de minas'] },
  { id: 'cat-p-179', name: 'Sorvete Pote Sabores (1.5L)', categoryId: 'cat-congelados', suggestedUnit: 'un', averagePrice: 24.90, keywords: ['sorvete', 'kibon', 'nestle'] },
  { id: 'cat-p-180', name: 'Açaí Pote Congelado (1kg ou 2L)', categoryId: 'cat-congelados', suggestedUnit: 'un', averagePrice: 26.00, keywords: ['açai', 'tigela'] },

  // ==========================================
  // OUTROS & DIVERSOS (cat-outros)
  // ==========================================
  { id: 'cat-p-181', name: 'Ração Seca para Cães Adultos (kg ou saco)', categoryId: 'cat-outros', suggestedUnit: 'pct', averagePrice: 58.00, keywords: ['racao', 'cachorro', 'pedigree', 'dog chow'] },
  { id: 'cat-p-182', name: 'Ração para Gatos Adultos (kg)', categoryId: 'cat-outros', suggestedUnit: 'pct', averagePrice: 28.00, keywords: ['racao', 'gato', 'whiskas', 'friskies'] },
  { id: 'cat-p-183', name: 'Areia Sanitária para Gatos (4kg)', categoryId: 'cat-outros', suggestedUnit: 'pct', averagePrice: 12.90, keywords: ['areia gato', 'higiene pet'] },
  { id: 'cat-p-184', name: 'Papel Alumínio Rolo (7.5m)', categoryId: 'cat-outros', suggestedUnit: 'un', averagePrice: 5.50, keywords: ['papel aluminio', 'churrasco', 'forno'] },
  { id: 'cat-p-185', name: 'Filme Plástico de PVC Rolo (15m)', categoryId: 'cat-outros', suggestedUnit: 'un', averagePrice: 4.90, keywords: ['filme pvc', 'plastico'] },
  { id: 'cat-p-186', name: 'Guardanapos de Papel (pct c/ 50)', categoryId: 'cat-outros', suggestedUnit: 'pct', averagePrice: 3.20, keywords: ['guardanapo', 'mesa'] },
  { id: 'cat-p-187', name: 'Fósforos Caixa Longa (pct c/ 10)', categoryId: 'cat-outros', suggestedUnit: 'pct', averagePrice: 4.80, keywords: ['fosforo', 'fogo', 'fogao'] },
  { id: 'cat-p-188', name: 'Carvão Vegetal para Churrasco (2.5kg)', categoryId: 'cat-outros', suggestedUnit: 'pct', averagePrice: 16.00, keywords: ['carvao', 'churrasco'] },
];

/**
 * Busca inteligente de produtos no catálogo por texto
 */
export function searchCatalogProducts(query: string, limit = 8): CatalogProduct[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  return PRODUCT_CATALOG.filter(product => {
    const matchName = product.name.toLowerCase().includes(clean);
    const matchKeywords = product.keywords.some(kw => kw.toLowerCase().includes(clean));
    return matchName || matchKeywords;
  }).slice(0, limit);
}
