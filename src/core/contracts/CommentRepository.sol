pragma solidity ^0.4.0;
import "./RestaurantRepositoryInterface.sol";
import "./SafeMath.sol";
contract CommentRepository {
    using SafeMath for uint;
    address private restaurantRepository;
    mapping(address=> uint[]) private queryCommentNoList; //rest => comment
    mapping(uint=> Comment) private queryComment; // no => comment
    mapping(address => uint) private queryTotalRating; //
    mapping(address=>mapping(address=>uint)) private queryDueDate; // ad

    uint private currentCommentNo;

    event CommentAllowed(address payer, address restaurant, uint duedate);


    struct Comment{
        uint no;
        address restaurant;
        address payer;
        string comment;
        uint rating;
        uint date;
    }


    constructor(){
    }

    function isValidRating(uint rating)public view returns(bool){
        if(rating>0 && rating<8){
            return true;
        } else {
            return false;
        }
    }
    function getDueDate(address restaurant) public view returns(uint){
        return queryDueDate[msg.sender][restaurant];
    }

    function makeComment(address _restaurant, string _comment, uint _rating) public {
        require(now<=queryDueDate[msg.sender][_restaurant]);
        require(isValidRating(_rating));
        currentCommentNo = currentCommentNo.add(1);
        Comment memory c;
        c.no = currentCommentNo;
        c.restaurant = _restaurant;
        c.comment = _comment;
        c.rating = _rating;
        c.payer = msg.sender;
        c.date = now;
        queryComment[currentCommentNo] = c;
        queryCommentNoList[_restaurant].push(currentCommentNo);
        queryTotalRating[_restaurant] = queryTotalRating[_restaurant].add(_rating);

        queryDueDate[msg.sender][_restaurant] = 0;
    }

    function getAverageRating(address rest) public view returns(uint){
        if(queryCommentNoList[rest].length==0) return 4;
        uint average = queryTotalRating[rest].div(queryCommentNoList[rest].length);
        return average;
    }

    function allowToComment(address payer) public{
        require(RestaurantRepositoryInterface(restaurantRepository).isRegisteredRestaurant(msg.sender));
        queryDueDate[payer][msg.sender] = now.add(1 days);
        CommentAllowed(payer, msg.sender, now.add(1 days));
    }

    function allowToCommentForTest(address payer, address restaurant) public{
        queryDueDate[payer][restaurant] = now.add(1 days);
        CommentAllowed(payer, restaurant, now.add(1 days));
    }

    function setRestaurantRepository(address repositoryAddress) public{
        require(restaurantRepository == address(0));
        restaurantRepository = repositoryAddress;
    }
    function getRestaurantRepositoryAddress() public view returns (address){
        return restaurantRepository;
    }

    function getCommentNoList(address addr) public view returns(uint[]){
        return queryCommentNoList[addr];
    }

    function getComment(uint no) public view returns(uint, address, address, string, uint, uint){
        Comment storage c = queryComment[no];
        return (c.no, c.restaurant, c.payer, c.comment, c.rating, c.date);
    }


}
