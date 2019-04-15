pragma solidity 0.4.24;

import "./MembershipRepositoryInterface.sol";
import "./CommentRepositoryInterface.sol";
import "./RestaurantRepositoryInterface.sol";
import "./SafeMath.sol";

contract Restaurant {
    using SafeMath for uint;

    enum CookingState {pending, inProgress, cancelled, rejected, complete} // 0 1 2 3 4
    event Payment(uint orderNo, uint emitTime);
    event NewOrder(uint orderNo, uint emitTime);
    event UpdateOrderStatus(uint orderNo, uint emitTime);

    struct MenuItem {
        uint no;
        string name;
        string desc;
        string imgURL;
        bool available;
        uint price;
    }

    struct Order {
        uint no;
        address payer;
        uint createdDate;
        uint paidDate;
        uint tableNo;
        uint[] itemNoList;
        uint totalPrice;
        uint refund;
        uint discount;
        uint finallyPaidAmt;
    }

    struct Location {
        int intLong; // integer value for longitude
        uint decLong; // decimal value for longitude
        int intLat; // integer value for latitude
        uint decLat; // decimal value for latitude
    }

    address private restaurantRepository;
    address private membershipRepository;
    address private commentRepository;
    string private name;
    string private desc;
    address private owner;
    string private contact;
    string private imgURL;
    uint private numOfTables;
    address[] private employees;
    uint[] private menuItemNoList;
    mapping(uint => MenuItem) queryMenuItem;
    uint private currentItemNo;
    uint private currentOrderNo;
    uint[] private unpaidOrderNoList;
    uint[] private paidOrderNoList;
    bytes32 private encryptedPassword;
    mapping(address => uint) private orderAllowance;
    mapping(uint => Order) private queryOrder;
    mapping(uint => mapping(uint => CookingState)) private kitchenMonitor; //orderNo => itemIndex=> CookingState
    bool private opened;
    Location private location;


    modifier isOwner{
        //        if (msg.sender == owner) {
        //            _;
        //        }
        _;
    }

    modifier isEmployee{
        //        if (msg.sender == owner) {
        //            _;
        //        }
        //
        //        for (uint i = 0; i < employees.length; i++) {
        //            if (msg.sender == employees[i]) {
        //                _;
        //            }
        //        }
        _;
    }

    modifier isOpened{
        require(opened == true);
        _;
    }

    modifier isClosed{
        require(opened == false);
        _;
    }

    modifier validTableNo(uint no){
        require(no > 0 && no <= numOfTables);
        _;
    }

    modifier validUnpaidOrder(uint orderNo, uint itemNoIndex){
        require(queryOrder[orderNo].no > 0 && queryOrder[orderNo].itemNoList.length > itemNoIndex && queryOrder[orderNo].paidDate == 0);
        _;
    }

    constructor(address _owner, string _name, string _desc, string _contact, string _imgURL, uint _numOfTables, address _membershipRepository, address _commentRepository) public{
        restaurantRepository = msg.sender;
        membershipRepository = _membershipRepository;
        owner = _owner;
        name = _name;
        desc = _desc;
        contact = _contact;
        imgURL = _imgURL;
        opened = false;
        numOfTables = _numOfTables;
        commentRepository = _commentRepository;
    }

    function changeRestaurantInfo(string _name, string _desc, string _contact, string _imgURL, uint _numOfTables) public isOwner isClosed {
        name = _name;
        desc = _desc;
        contact = _contact;
        imgURL = _imgURL;
        numOfTables = _numOfTables;
    }

    function changeNumOfTables(uint _numOfTables) public isOwner isClosed {
        require(_numOfTables > 0 && _numOfTables < 100);
        numOfTables = _numOfTables;
    }


    function addEmployee(address _employee) public isOwner isClosed {
        for (uint i = 0; i < employees.length; i++) {
            require(employees[i] != _employee);
        }
        employees.push(_employee);
    }

    function removeEmployee(uint index) public isOwner isClosed {
        require(index < employees.length);
        employees[index] = employees[employees.length - 1];
        employees.length = employees.length.sub(1);
    }

    function getEmployeeList() public view returns (address[]){
        return employees;
    }

    function addMenuItem(string _name, string _desc, string _imgURL, uint _price) public isOwner isClosed {
        require(_price > 0);
        currentItemNo = currentItemNo.add(1);
        MenuItem memory m = MenuItem(currentItemNo, _name, _desc, _imgURL, true, _price);
        menuItemNoList.push(currentItemNo);
        queryMenuItem[currentItemNo] = m;
    }

    function changeMenuItem(uint itemNo, string _name, string _desc, string _imgURL, uint _price) public isOwner isClosed {
        bool found = false;
        for (uint i = 0; i < menuItemNoList.length; i++) {
            if (menuItemNoList[i] == itemNo) {
                found = true;
                queryMenuItem[itemNo] = MenuItem(itemNo, _name, _desc, _imgURL, queryMenuItem[itemNo].available, _price);
            }
        }
        require(found);
    }

    function removeMenuItem(uint itemNo) public isOwner isClosed {
        bool found = false;
        for (uint i = 0; i < menuItemNoList.length; i++) {
            if (menuItemNoList[i] == itemNo) {
                found = true;
                menuItemNoList[i] = menuItemNoList[menuItemNoList.length - 1];
                menuItemNoList.length = menuItemNoList.length.sub(1);
            }
        }
        require(found);
    }

    function setPassword(string password) public isOwner {
        encryptedPassword = sha256(bytes(password));
    }

    function getEncryptedPassword() public view returns (bytes32){
        return encryptedPassword;
    }

    function getMenuItemNoList() public view returns (uint[]){
        return menuItemNoList;
    }

    function setOrderAllowance(string password){
        require(encryptedPassword == sha256(bytes(password)));
        orderAllowance[msg.sender] = now + 1 hours;
    }

    function getOrderAllowance() public view returns (uint){
        return orderAllowance[msg.sender];
    }

    function getMenuItem(uint itemNo) public view returns (uint, string, string, string, bool, uint){
        MenuItem storage menuItem = queryMenuItem[itemNo];
        return (menuItem.no, menuItem.name, menuItem.desc, menuItem.imgURL, menuItem.available, menuItem.price);
    }

    function changeMenuItemAvailability(uint itemNo) public isEmployee {
        MenuItem storage menuItem = queryMenuItem[itemNo];
        if (menuItem.available) menuItem.available = false;
        else menuItem.available = true;
    }

    function placeOrder(uint _tableNo, uint[] _itemNoList) public payable isOpened validTableNo(_tableNo) returns (uint) {
        uint _totalPrice = 0;
        require(orderAllowance[msg.sender]>now);
        for (uint i = 0; i < _itemNoList.length; i++) {
            bool found = false;
            for (uint j = 0; j < menuItemNoList.length; j++) {
                if (_itemNoList[i] == menuItemNoList[j]) {
                    found = true;
                    require(queryMenuItem[menuItemNoList[j]].available);
                    _totalPrice = _totalPrice.add(queryMenuItem[menuItemNoList[j]].price);
                    break;
                }
            }
            require(found);
        }
        require(msg.value == _totalPrice.mul(1 ether));
        address(this).send(msg.value);
        currentOrderNo = currentOrderNo.add(1);
        Order memory newOrder = Order(
            {no : currentOrderNo,
            payer : msg.sender,
            createdDate : now,
            paidDate : 0,
            tableNo : _tableNo,
            itemNoList : _itemNoList,
            refund : 0,
            discount : 0,
            finallyPaidAmt : 0,
            totalPrice : _totalPrice
            });
        queryOrder[currentOrderNo] = newOrder;
        unpaidOrderNoList.push(currentOrderNo);
        RestaurantRepositoryInterface(restaurantRepository).setVisitedRestaurant(newOrder.payer);
        emit NewOrder(currentOrderNo, now);
        return currentOrderNo;
    }

    function cancelMenuItem(uint _orderNo, uint _itemNoIndex) public isOpened validUnpaidOrder(_orderNo, _itemNoIndex) {// by payer
        Order storage targetOrder = queryOrder[_orderNo];
        CookingState currentState = kitchenMonitor[_orderNo][_itemNoIndex];
        require(currentState == CookingState.pending || currentState == CookingState.inProgress);
        uint itemNo = targetOrder.itemNoList[_itemNoIndex];
        if (currentState == CookingState.pending) targetOrder.refund = targetOrder.refund.add(queryMenuItem[itemNo].price);
        else targetOrder.refund = targetOrder.refund.add(queryMenuItem[itemNo].price.div(2));
        kitchenMonitor[_orderNo][_itemNoIndex] = CookingState.cancelled;
        emit UpdateOrderStatus(_orderNo, now);
        makePaymentIfPossible(_orderNo);

    }


    function rejectMenuItem(uint _orderNo, uint _itemNoIndex) public isOpened isEmployee validUnpaidOrder(_orderNo, _itemNoIndex) {
        Order storage targetOrder = queryOrder[_orderNo];
        CookingState currentState = kitchenMonitor[_orderNo][_itemNoIndex];
        require(currentState == CookingState.pending || currentState == CookingState.inProgress);
        uint itemNo = targetOrder.itemNoList[_itemNoIndex];
        targetOrder.refund = targetOrder.refund.add(queryMenuItem[itemNo].price);
        kitchenMonitor[_orderNo][_itemNoIndex] = CookingState.rejected;
        emit UpdateOrderStatus(_orderNo, now);
        makePaymentIfPossible(_orderNo);

    }

    function makeProgress(uint _orderNo, uint _itemNoIndex) public isOpened isEmployee validUnpaidOrder(_orderNo, _itemNoIndex) {
        CookingState currentState = kitchenMonitor[_orderNo][_itemNoIndex];
        require(currentState == CookingState.pending || currentState == CookingState.inProgress);
        if (currentState == CookingState.pending) kitchenMonitor[_orderNo][_itemNoIndex] = CookingState.inProgress;
        else kitchenMonitor[_orderNo][_itemNoIndex] = CookingState.complete;
        emit UpdateOrderStatus(_orderNo, now);
        makePaymentIfPossible(_orderNo);


    }

    function getOwnerAddress() public view returns (address){
        return owner;
    }

    function makePaymentIfPossible(uint _orderNo) public payable {

        Order storage targetOrder = queryOrder[_orderNo];
        require(targetOrder.paidDate == 0);
        bool completed = true;
        for (uint j = 0; j < targetOrder.itemNoList.length; j++) {
            CookingState currentState = kitchenMonitor[_orderNo][j];
            if (currentState == CookingState.pending || currentState == CookingState.inProgress) completed = false;
        }
        // make Payment
        if (completed) {
            uint originalPriceToPay = targetOrder.totalPrice.sub(targetOrder.refund);
            targetOrder.discount = getDiscountAmount(targetOrder.payer, originalPriceToPay);
            targetOrder.finallyPaidAmt = originalPriceToPay.sub(targetOrder.discount);
            uint amtReturnedToPayer = targetOrder.totalPrice.sub(targetOrder.finallyPaidAmt);
            owner.send(targetOrder.finallyPaidAmt.mul(1 ether));
            targetOrder.payer.send(targetOrder.refund.add(targetOrder.discount).mul(1 ether));
            targetOrder.paidDate = now;
            emit Payment(_orderNo, now);
            CommentRepositoryInterface(commentRepository).allowToComment(targetOrder.payer);
            for (uint i = 0; i < unpaidOrderNoList.length; i++) {
                if (unpaidOrderNoList[i] == _orderNo) {
                    paidOrderNoList.push(unpaidOrderNoList[i]);
                    unpaidOrderNoList[i] = unpaidOrderNoList[unpaidOrderNoList.length - 1];
                    unpaidOrderNoList.length = unpaidOrderNoList.length.sub(1);
                }
            }
            bool remove = true;
            for (uint k = 0; k < unpaidOrderNoList.length; k++) {
                if (queryOrder[unpaidOrderNoList[k]].payer == targetOrder.payer) {
                    remove = false;
                    break;
                }
            }
            if (remove) {
                RestaurantRepositoryInterface(restaurantRepository).removeVisitedRestaurant(targetOrder.payer);
            }

            RestaurantRepositoryInterface(restaurantRepository).informOrderPaid(targetOrder.payer, _orderNo);
        }


    }

    function getDiscountAmount(address customer, uint originalPriceToPay) public returns (uint){
        return MembershipRepositoryInterface(membershipRepository).getDiscountAmount(customer, originalPriceToPay, address(this));
    }

    function getRestaurantInfo() public view returns (address, string, string, string, string, uint, bool){
        return (owner, name, desc, contact, imgURL, numOfTables, opened);
    }

    function getLocationInfo() public view returns (int, uint, int, uint){
        return (location.intLong, location.decLong, location.intLat, location.decLat);
    }

    function setLocation(int _intLong, uint _decLong, int _intLat, uint _decLat) public isOwner isClosed {
        location.intLong = _intLong;
        location.decLong = _decLong;
        location.intLat = _intLat;
        location.decLat = _decLat;
    }

    function open() public isOwner {
        require(menuItemNoList.length > 0 && numOfTables > 0);
        opened = true;
    }

    function getBalance() public view returns (uint){
        return address(this).balance;
    }

    function close() public isOwner {
        opened = false;
    }

    function getOrder(uint _no) public view returns (uint, address, uint, uint, uint, uint[], uint, uint, uint, uint, uint[]){

        Order storage order = queryOrder[_no];
        require(order.no > 0);


        return (order.no, order.payer, order.createdDate, order.paidDate, order.tableNo, order.itemNoList, order.totalPrice, order.refund, order.discount, order.finallyPaidAmt, getCookingStateList(order.no));


    }

    function getUnpaidOrderNoList() public view returns (uint[]){
        return unpaidOrderNoList;
    }

    function getPaidOrderNoList() public view returns (uint[]){
        return paidOrderNoList;
    }

    function getCookingState(uint _no, uint _itemIndex) public view returns (uint){

        return uint(kitchenMonitor[_no][_itemIndex]);
    }

    function getCookingStateList(uint _no) public view returns (uint[]){
        Order storage order = queryOrder[_no];
        uint numOfItems = order.itemNoList.length;

        uint[] memory stateArray = new uint[](numOfItems);
        for (uint i = 0; i < numOfItems; i++) {
            stateArray[i] = getCookingState(_no, i);
        }

        return stateArray;
    }

    function getNumOfUnpaidOrders() public view returns (uint){
        return unpaidOrderNoList.length;
    }


    function getRestaurantRepository() public view returns (address) {return restaurantRepository;}

    function getMembershipRepository() public view returns (address) {return membershipRepository;}

    function hasMenuItems() public view returns (bool){return menuItemNoList.length > 0;}

    function hasLocationInfo() public view returns (bool){return location.intLat > 0 && location.intLong > 0;}


}
