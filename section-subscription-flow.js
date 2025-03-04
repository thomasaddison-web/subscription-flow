class SubSection extends HTMLElement {
  constructor() {
    super();

    this.productJson = sub_product;
    this.addToCartCTA = this.querySelector('.js-sub-add-to-cart');
    this.variantData = this.productJson.variants;

    if(this.productJson){
      this.addEventListener('change', this.onOptionChange);
      this.addToCartCTA.addEventListener('click', this.addToCart.bind(this));
    }
  }


  onOptionChange() {
    this.updateOptions();
  }
  
  updateOptions() {
    this.options = Array.from(this.querySelectorAll('input:checked'), (input) => input.value);
    const coffeeType = this.querySelector('.js-coffee-val');
    const groundType = this.querySelector('.js-ground-val');
    const amountText = this.querySelector('.js-amount-val');
    const deliveryText = this.querySelector('.js-delivery-val');
    const subPrice = this.querySelector('.js-sub-price');
    const frequencySelected = this.querySelector('input.js-delivery-select:checked').dataset.text;
    
    this.currentVariant = this.variantData.find((variant) => {
      return !variant.options.map((option, index) => {
        return this.options[index] === option;
      }).includes(false);
    });
  
    
    coffeeType.innerText = this.currentVariant.option1;
    groundType.innerText = this.currentVariant.option2;
    subPrice.innerText = formatMoney(this.currentVariant.price);
    amountText.innerText = this.currentVariant.option3;
    deliveryText.innerText = frequencySelected;
    if(this.currentVariant.available){
      this.addToCartCTA.removeAttribute('disabled')
    }else{
      this.addToCartCTA.setAttribute('disabled', 'disabled')
    }
  }

  addToCart() {
    this.options = Array.from(this.querySelectorAll('input:checked'), (input) => input.value);
    const frequencySelectedID = this.querySelector('input.js-delivery-select:checked').value;
    this.currentVariant = this.variantData.find((variant) => {
      return !variant.options.map((option, index) => {
        return this.options[index] === option;
      }).includes(false);
    });
    
    const button = this.addToCartCTA;
    const item = {
      items: [
        {
          quantity: 1,
          id: this.currentVariant.id,
          selling_plan: frequencySelectedID
        }
      ]
    }
    console.log(this.currentVariant);
    button.setAttribute('disabled', 'disabled')

    fetch(window.Shopify.routes.root + 'cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    })
    .then(response => {
      //window.location.href = "/checkout";
      button.removeAttribute('disabled')
      return response.json();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

}
  
customElements.define('sub-section', SubSection);
