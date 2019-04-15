pragma solidity ^0.4.0;

interface MembershipRepositoryInterface {
    function getDiscountAmount(address customer, uint originalPriceToPay, address restaurant) external returns(uint);
}
