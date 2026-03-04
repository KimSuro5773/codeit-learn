// cart.js
class Cart {
  // 장바구니 인스턴스 생성 시 items 배열을 초기화합니다.
  constructor() {
    this.items = [];
  }

  _findItemById(itemId) {
    return this.items.find((item) => item.id === itemId);
  }

  // 장바구니에 상품을 추가하는 메서드입니다.
  addItem(item) {
    // 만약 이미 존재하는 아이템이라면 수량을 추가한다.
    const existingItem = this._findItemById(item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      // item은 객체 형태로, id, name, price, quantity 속성을 가집니다.
      this.items.push(item);
    }
  }

  removeItem(itemId) {
    this.items = this.items.filter((item) => item.id !== itemId);
  }

  updateQuantity(itemId, quantity) {
    if (quantity < 1) {
      throw new Error("수량은 1보다 작을 수 없습니다.");
    }

    const item = this._findItemById(itemId);

    if (!item) {
      throw new Error("존재하지 않는 상품입니다.");
    }

    item.quantity = quantity;
  }

  getTotalPrice() {
    return this.items.reduce((acc, cur) => {
      return acc + cur.price * cur.quantity;
    }, 0);
  }

  clear() {
    this.items = [];
  }
}

module.exports = Cart;
