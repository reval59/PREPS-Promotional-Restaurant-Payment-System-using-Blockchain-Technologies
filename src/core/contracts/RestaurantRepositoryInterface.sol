pragma solidity ^0.4.0;

interface RestaurantRepositoryInterface {
    function isOwner(address owner) external returns (bool);
    function getRestaurantAddress(address owner) external returns (address);
    function isRegisteredRestaurant(address addr) external returns(bool);
    function setVisitedRestaurant(address payer) external;
    function removeVisitedRestaurant(address payer) external;
    function informOrderPaid(address payer, uint orderNo) external;
}
