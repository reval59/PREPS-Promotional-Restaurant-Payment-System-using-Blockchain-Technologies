pragma solidity 0.4.24;
import "./SafeMath.sol";
import "./Restaurant.sol";

contract RestaurantRepository {
    mapping(address=>address) private queryRestaurant;
    address[] private restaurantAddressList;
    address private membershipRepository;
    address private commentRepository;
    mapping(address=>address) private queryVisitedRestaurant; // pater => restaurant
    event PaidOrder(address restaurant, address payer, uint orderNo);

    constructor() public {
    }

    function registerRestaurant(string _name, string _desc, string _contact, string _imgURL, uint _numOfTables) public returns(address){
        require(_numOfTables>0);


        require(queryRestaurant[msg.sender]==address(0));
        Restaurant r = new Restaurant(msg.sender, _name, _desc, _contact, _imgURL, _numOfTables, membershipRepository, commentRepository);
        queryRestaurant[msg.sender] = address(r);
        restaurantAddressList.push(address(r));
        return address(r);
    }

    function registerRestaurantForTest(address owner, string _name, string _desc, string _contact, string _imgURL, uint _numOfTables) public returns(address){
        require(_numOfTables>0);

        require(queryRestaurant[owner]==address(0));
        Restaurant r = new Restaurant(owner, _name, _desc, _contact, _imgURL, _numOfTables, membershipRepository, commentRepository);
        queryRestaurant[owner] = address(r);
        restaurantAddressList.push(address(r));
        return address(r);
    }

    function setMembershipRepository(address repositoryAddress) public{
        require(membershipRepository==address(0));
        membershipRepository = repositoryAddress;
    }

    function setCommentRepository(address repositoryAddress) public{
        require(commentRepository==address(0));
        commentRepository = repositoryAddress;
    }

    function isOwner(address owner) public view returns (bool) {
        return queryRestaurant[owner]!=address(0);
    }

    function getRestaurantAddress(address owner) public view returns (address){
        require(isOwner(owner));
        return queryRestaurant[owner];
    }

    function getRestaurantAddressList() public view returns (address[]){
        return restaurantAddressList;
    }

    function isRegisteredRestaurant(address addr) public view returns(bool){
        Restaurant r = Restaurant(addr);
        address owner = r.getOwnerAddress();
        return isOwner(owner);
    }

    function setVisitedRestaurant(address payer) public {
        require(isRegisteredRestaurant(msg.sender));
        queryVisitedRestaurant[payer] = msg.sender;
    }

    function removeVisitedRestaurant(address payer) public {
        require(isRegisteredRestaurant(msg.sender));
        queryVisitedRestaurant[payer] = address(0);
    }

    function getVisitedRestaurant(address addr) public view returns(address){
        return queryVisitedRestaurant[addr];
    }

    function informOrderPaid(address payer, uint orderNo) public{
        require(isRegisteredRestaurant(msg.sender));
        emit PaidOrder(msg.sender, payer, orderNo);
    }

}
