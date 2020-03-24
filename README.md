# PREPS
Promotional Restaruant Payment System using Blockchain Technologies

## Introduction (Korean)
최근 현대사회에서는 직장인과 학생들을 포함한 많은 사람들이 집에서 여러가지 이유등(시간,편의)으로 인해 밖에서 외식을 하는 추세이며, 잦은 외식으로 인한 누적된 비용은 학생들과 사회초년생들에게 부담이되고 프랜차이즈들의(e.g.맥도날드,스타벅스,KFC) 발전으로 인해 점점 많은 골목상가들은 안정적으로 고객들을 유치하는데 힘이 들고 있습니다.

만약에 매달 1만원을 내고 매일 근처 100m내에 있는 특정 식당 10군데에서 음식을 주문을 할때마다 1천원씩 할인을 해주는 정기 멤버식 혜텍이 있다면 어떨까요? 이러한 혜택은 매달 최소 11번 이상을 근처 식당에 외식을 하는 사람들에게는 매우 솔깃한 제안일것입니다. (동시에 혜택을 제공하는 10개의 식당들 또한 안정적으로 고객을 유치할수있다는 장점이 있겠죠.) 이러한 혜텍은 보통 카드사와 제휴사가 계약을 체결을 함으로써 이루어지는데 그 말은 유명하지 않은 골목식당들은 이러한 계약을 체결하는것이 불가능하고 또한  근처에 제휴하는 식당이 있어야 한다는 제약이 따릅니다.

PREPS(Promotional Restaruant Payment System using Blockchain Technologies)는 이러한 문제들을 블록체인의 기술을 통해 극복하고자 만들어졌으며 식당규모에 상관없이 가입되어있는 모든 식당들이 주도적으로 멤버십혜택을 설계하고 만들고 또한 실시간으로 주문을 모니터링 할수있는 플랫폼을 제공합니다.

![image](https://github.com/reval59/PREPS-Promotional-Restaurant-Payment-System-using-Blockchain-Technologies/blob/master/screenshots/intro.png)

## Introduction
In recent decades, an increasing number of people dining out has caused the restaurant industry in Hong Kong to rapidly grown up, which has brought about a fierce competition between restaurant owners promoting their restaurants by introducing a new menu, offering discounts for meal deals or some coupons in order to attract customers and encourage their future visits, which, however, does not seem effective enough to convert such a floating population into the actual payments.

Not only that, a daily fluctuation in the number of visits for different timeslots unique to the food service industry has been a nuisance to restaurant hosts in the determination of the number of employees to be hired for serving as well as the estimation of waiting times for ordering, which is a key determinant of the quality of service.

From an idea of membership subscriptions provided by credit card issuers, which enable card holders to enjoy a discount in multiple restaurants in partnership at a cost of paying monthly fees, in this paper, we propose a new payment system based on blockchain technologies which not only simplifies the traditional ordering procedures, to a great extent, along with the real-time order tracking and cancellation but also provides a consensus-driven platform for restaurant owners to design cooperative and location-based discount promotion schemes on their own without the need of external payment agents.

Such joint discount offers would be economically appealing to customers, particulary, some of whom are on a tight budget, having no choice but to regularly dine out for reasons of the time constraint and therefore suffering from the acculumlation of dining fees, which would eventually become a win-win solution for both parties.

![image](https://github.com/reval59/PREPS-Promotional-Restaurant-Payment-System-using-Blockchain-Technologies/blob/master/screenshots/intro.png)

## Screenshots
![image](https://github.com/reval59/PREPS-Promotional-Restaurant-Payment-System-using-Blockchain-Technologies/blob/master/screenshots/login.png)

![image](https://github.com/reval59/PREPS-Promotional-Restaurant-Payment-System-using-Blockchain-Technologies/blob/master/screenshots/register.png)

![image](https://github.com/reval59/PREPS-Promotional-Restaurant-Payment-System-using-Blockchain-Technologies/blob/master/screenshots/dashboard.png)

![image](https://github.com/reval59/PREPS-Promotional-Restaurant-Payment-System-using-Blockchain-Technologies/blob/master/screenshots/order.png)

## Main Technology Stacks
* Frontend: Vue.js (including Vuetify.js, Vuex.js), axios.js, web3.js
* Backend: Solidity (an object-oriented programming language for writing smart contracts)

## Prerequisite
* Installation of Ganache (download link: https://www.trufflesuite.com/ganache)
* Installation of Xcode (for mobile version only)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run cordova-serve-android # Development Android 
npm run cordova-build-android # Build Android 
npm run cordova-serve-ios # Development IOS 
npm run cordova-build-ios # Build IOS 
npm run cordova-serve-browser # Development Browser 
npm run cordova-build-browser # Build Browser 
npm run cordova-prepare # prepare for build 
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
