pragma solidity 0.4.24;

import "./RestaurantRepositoryInterface.sol";
import "./SafeMath.sol";

contract MembershipRepository {
    event RequestEvent(address stakeholder, uint date);
    event PlanEvent(address stakeholder, uint date);

    using SafeMath for uint;
    address private restaurantRepository;
    mapping(uint => PartnershipRequest) private queryRequest;
    mapping(address => uint[]) private queryRequestNoList;
    mapping(uint => MembershipPlan) private queryPlan;
    mapping(address => uint[]) private queryPlanNoList;

    mapping(uint => address[]) private queryMembers; //no=>members
    mapping(address => uint[]) private queryPurchasedMembershipNoList; //member=>membershipNoList
    mapping(uint => mapping(address => uint)) private queryExpiryDate; //no=>member=>date
    mapping(uint => uint) private queryTotalAmtCollected;
    mapping(address => uint) private queryAmtToWithdraw;

    uint private currentRequestNo;
    uint private currentPlanNo;


    struct PartnershipRequest {
        uint no;
        address proposer;
        address[] partners;
        string msgFromProposer;
        bool[] signature;
    }

    struct MembershipPlan {
        bool active;
        uint no;
        string name;
        address[] owners;
        address[] restaurants;
        bool[] signature;
        uint[] minSpentAmtList;
        uint[] discountAmtList;
        uint startDate;
        uint endDate;
        uint monthlyFee;
    }



    constructor () public {
    }


    function subscribeMembership(uint no, uint numOfMonths) public payable {
        MembershipPlan storage targetPlan = queryPlan[no];
        require(targetPlan.active);
        require(targetPlan.startDate <= now);
        uint amtToPay = numOfMonths.mul(targetPlan.monthlyFee).mul(1 ether);
        require(msg.value == amtToPay);

        uint sec = numOfMonths.mul(30 days);
        uint expiryDate = queryExpiryDate[no][msg.sender];

        if (expiryDate == 0) {
            //new member

            queryMembers[no].push(msg.sender);
            queryPurchasedMembershipNoList[msg.sender].push(no);

        }

        if (expiryDate > now) {
            require(expiryDate.add(sec) <= targetPlan.endDate);
            queryExpiryDate[no][msg.sender] = expiryDate.add(sec);
        } else {
            require(now.add(sec) <= targetPlan.endDate);
            queryExpiryDate[no][msg.sender] = now.add(sec);
        }

        queryTotalAmtCollected[no] = queryTotalAmtCollected[no].add(amtToPay);
        address(this).send(amtToPay);
        for (uint i = 0; i < targetPlan.owners.length; i++) {
            uint amtToWithdraw = amtToPay.div(targetPlan.owners.length);
            queryAmtToWithdraw[targetPlan.owners[i]] = queryAmtToWithdraw[targetPlan.owners[i]].add(amtToWithdraw);
        }


    }

    function getBalance() public view returns (uint){
        return address(this).balance;
    }

    function withdraw() public {
        //        msg.sender.send(queryAmtToWithdraw[msg.sender]);
        msg.sender.call.value(queryAmtToWithdraw[msg.sender])();
        queryAmtToWithdraw[msg.sender] = 0;
    }

    function getAmtToWithdraw() public view returns (uint){
        return queryAmtToWithdraw[msg.sender];
    }


    //    function getDiscountAmount(address customer, uint originalPriceToPay) public view returns(uint){
    //        uint maxDiscountAmt = 0;
    //
    //        return maxDiscountAmt;
    //    }

    //    struct MembershipPlan {
    //        bool active;
    //        uint no;
    //        string name;
    //        address[] owners;
    //        address[] restaurants;
    //        bool[] signature;
    //        uint[] minSpentAmtList;
    //        uint[] discountAmtList;
    //        uint startDate;
    //        uint endDate;
    //        uint monthlyFee;
    //    }


    function getDiscountAmount(address customer, uint originalPriceToPay, address restaurant) public view returns (uint){
        uint maxDiscountAmt = 0;
        for (uint i = 0; i < queryPurchasedMembershipNoList[customer].length; i++) {
            uint planNO = queryPurchasedMembershipNoList[customer][i];
            if (queryExpiryDate[planNO][customer] >= now) {
                MembershipPlan storage targetPlan = queryPlan[planNO];
                for (uint j = 0; j < targetPlan.restaurants.length; j++) {
                    if (targetPlan.restaurants[j] == restaurant && targetPlan.minSpentAmtList[j] <= originalPriceToPay && targetPlan.discountAmtList[j] > maxDiscountAmt) {
                        maxDiscountAmt = targetPlan.discountAmtList[j];
                    }
                }
            } else {
                continue;
            }
        }
        return maxDiscountAmt;
    }

    function proposePartnership(address[] _partners, string _msg) public {
        require(isOwner(msg.sender));
        for (uint i = 0; i < _partners.length; i++) {
            require(isOwner(_partners[i]) && _partners[i] != msg.sender);
        }
        currentRequestNo = currentRequestNo.add(1);
        PartnershipRequest memory request;
        request.no = currentRequestNo;
        request.proposer = msg.sender;
        request.partners = _partners;
        request.msgFromProposer = _msg;
        request.signature = new bool[](_partners.length);
        queryRequest[currentRequestNo] = request;

        queryRequestNoList[msg.sender].push(currentRequestNo);
        for (uint j = 0; j < _partners.length; j++) {
            queryRequestNoList[_partners[j]].push(currentRequestNo);
        }
        emitRequestEvent(request.no);


    }

    function emitRequestEvent(uint _no) private {
        PartnershipRequest storage targetRequest = queryRequest[_no];
        for (uint i = 0; i < targetRequest.partners.length; i++) {
            emit RequestEvent(targetRequest.partners[i], now);
        }
        emit RequestEvent(targetRequest.proposer, now);
    }

    function emitPlanEvent(uint _no) private {
        MembershipPlan storage targetPlan = queryPlan[_no];

        for (uint i = 0; i < targetPlan.owners.length; i++) {
            emit PlanEvent(targetPlan.owners[i], now);
        }
    }

    function acceptPartnershipRequest(uint _no) public {
        PartnershipRequest storage targetRequest = queryRequest[_no];
        bool inPartnership = false;
        uint sigIndex;
        for (uint i = 0; i < targetRequest.partners.length; i++) {
            if (targetRequest.partners[i] == msg.sender) {
                inPartnership = true;
                sigIndex = i;
            }
        }
        require(inPartnership);
        require(targetRequest.signature[sigIndex] == false);
        targetRequest.signature[sigIndex] = true;

        bool onConsensus = true;
        for (uint j = 0; j < targetRequest.signature.length; j++) {
            if (targetRequest.signature[j] == false) {
                onConsensus = false;
            }
        }
        emitRequestEvent(_no);
        if (onConsensus) {
            initMembershipPlan(_no);
        }

    }

    function initMembershipPlan(uint requestNo) private {
        currentPlanNo = requestNo;
        PartnershipRequest storage targetRequest = queryRequest[requestNo];
        MembershipPlan memory plan;
        plan.no = currentPlanNo;
        plan.name = "";
        uint numOfParties = queryRequest[requestNo].partners.length.add(1);
        plan.owners = new address[](numOfParties);
        plan.restaurants = new address[](numOfParties);
        plan.signature = new bool[](numOfParties);
        plan.minSpentAmtList = new uint[](numOfParties);
        plan.discountAmtList = new uint[](numOfParties);
        plan.active = false;


        for (uint i = 0; i < numOfParties; i++) {
            if (i == 0) {
                plan.owners[i] = targetRequest.proposer;
                plan.restaurants[i] = getRestaurantAddress(targetRequest.proposer);
            } else {
                plan.owners[i] = targetRequest.partners[i - 1];
                plan.restaurants[i] = getRestaurantAddress(targetRequest.partners[i - 1]);
            }
        }
        plan.startDate = 0;
        plan.endDate = 0;
        plan.monthlyFee = 0;

        queryPlan[currentPlanNo] = plan;

        queryPlanNoList[targetRequest.proposer].push(currentPlanNo);
        for (uint j = 0; j < targetRequest.partners.length; j++) {
            queryPlanNoList[targetRequest.partners[j]].push(currentPlanNo);
        }
        emitPlanEvent(currentPlanNo);


    }

    function setPlanDiscountAmt(uint no, uint discountAmt, uint minSpentAmt) public {
        require(isReachedOnAgreement(no) == false);
        require(discountAmt > 0);
        require(minSpentAmt > discountAmt);
        uint index = getIndexInPlan(no, msg.sender);
        MembershipPlan storage targetPlan = queryPlan[no];
        targetPlan.discountAmtList[index] = discountAmt;
        targetPlan.minSpentAmtList[index] = minSpentAmt;

        initSignature(no);
    }

    function setPlan(uint no, string _name, uint _startDate, uint _endDate, uint _monthlyFee) public {
        require(isReachedOnAgreement(no) == false);
        require(checkInPartnership(no, msg.sender));
        //        require(_startDate > now);
        require(_endDate.sub(now) >= 24 weeks);
        require(_monthlyFee > 0);
        MembershipPlan storage targetPlan = queryPlan[no];
        targetPlan.name = _name;
        targetPlan.startDate = now;
        targetPlan.endDate = _endDate;
        targetPlan.monthlyFee = _monthlyFee;

        initSignature(no);
    }

    function acceptPlan(uint no) public {
        require(isValidPlan(no) == true);
        uint index = getIndexInPlan(no, msg.sender);
        MembershipPlan storage targetPlan = queryPlan[no];
        require(targetPlan.signature[index] == false);
        targetPlan.signature[index] = true;

        if (isReachedOnAgreement(no) == true) {
            targetPlan.active = true;
        }
        emitPlanEvent(no);
    }

    function isValidPlan(uint no) public view returns (bool) {
        MembershipPlan storage targetPlan = queryPlan[no];
        if (targetPlan.startDate == 0 || targetPlan.endDate.sub(targetPlan.startDate) < 24 weeks || targetPlan.monthlyFee == 0) {
            return false;
        }
        for (uint i = 0; i < targetPlan.owners.length; i++) {
            if (targetPlan.discountAmtList[i] == 0 || targetPlan.minSpentAmtList[i] <= targetPlan.discountAmtList[i]) {
                return false;
            }
        }
        return true;
    }

    function isReachedOnAgreement(uint no) public view returns (bool){
        MembershipPlan storage targetPlan = queryPlan[no];
        for (uint i = 0; i < targetPlan.signature.length; i++) {
            if (targetPlan.signature[i] == false) {
                return false;
            }
        }
        return true;
    }

    function checkInPartnership(uint no, address addr) public view returns (bool){
        MembershipPlan storage targetPlan = queryPlan[no];
        for (uint i = 0; i < targetPlan.owners.length; i++) {
            if (targetPlan.owners[i] == addr) {
                return true;
            }
        }
        return false;
    }

    function getIndexInPlan(uint no, address addr) public view returns (uint) {
        MembershipPlan storage targetPlan = queryPlan[no];
        bool found = false;
        uint index;
        for (uint i = 0; i < targetPlan.owners.length; i++) {
            if (targetPlan.owners[i] == addr) {
                index = i;
                found = true;
            }
        }
        require(found);
        return index;
    }

    function initSignature(uint no) private {
        MembershipPlan storage targetPlan = queryPlan[no];
        for (uint i = 0; i < targetPlan.owners.length; i++) {
            targetPlan.signature[i] = false;
        }
        emitPlanEvent(no);
    }

    function setRestaurantRepository(address repositoryAddress) public {
        require(restaurantRepository == address(0));
        restaurantRepository = repositoryAddress;
    }

    function getRestaurantRepositoryAddress() public view returns (address){
        return restaurantRepository;
    }


    function isOwner(address addr) public returns (bool){
        return RestaurantRepositoryInterface(restaurantRepository).isOwner(addr);
    }

    function getRestaurantAddress(address owner) public returns (address){
        return RestaurantRepositoryInterface(restaurantRepository).getRestaurantAddress(owner);
    }


    function getRequestNoList(address addr) public view returns (uint[]){
        return queryRequestNoList[addr];
    }

    function getPlanNoList(address addr) public view returns (uint[]){
        return queryPlanNoList[addr];
    }

    function getRequest(uint no) public view returns (uint, address, address[], string, bool[]){
        PartnershipRequest storage r = queryRequest[no];
        return (r.no, r.proposer, r.partners, r.msgFromProposer, r.signature);
    }

    function getPlan(uint no) public view returns (uint, string, address[], uint[], uint[], uint, uint, uint, bool, bool[]){
        MembershipPlan storage p = queryPlan[no];
        return (p.no, p.name, p.owners, p.minSpentAmtList, p.discountAmtList, p.startDate, p.endDate, p.monthlyFee, p.active, p.signature);
    }

    function getPlanSignature(uint no) public view returns (bool[]){
        MembershipPlan storage p = queryPlan[no];
        return p.signature;
    }

    function getCurrentPlanNo() public view returns (uint){
        return currentPlanNo;
    }


    function getMembers(uint no) public view returns (address[]){
        return queryMembers[no];
    }

    function getPurchasedMembershipNoList(address addr) public view returns (uint[]){
        return queryPurchasedMembershipNoList[addr];
    }

    function getExpiryDate(uint no, address member) public view returns (uint){
        return queryExpiryDate[no][member];
    }

    function getTotalAmtCollected(uint no) public view returns (uint){
        return queryTotalAmtCollected[no];
    }

    function getNow()public view returns(uint){
        return now;
    }

    function sampleMembership() public {
        currentPlanNo = currentPlanNo.add(1);
        MembershipPlan memory Plan;
        Plan.no = currentPlanNo;
        Plan.name = "ABC";
        uint numOfParties = 3;
        Plan.owners = new address[](numOfParties);
        Plan.owners[0] = 0xb2C6709463c084b00Db413488f5D6677C39d27BE;
        Plan.owners[1] = 0xB53A4E90b720c68d5BeB996739c2BAA4fcBD10B6;
        Plan.owners[2] = 0x42033Ed8A06DF40Fd4933F5D03E2558aE1412f15;
        Plan.restaurants = new address[](numOfParties);
        Plan.restaurants[0] = 0x5E3263F3259F5e30F5Ad31e1055433E006517d18;
        Plan.restaurants[1] = 0xe2fb20706A4C08129DF1375f584C6cb4f4459fab;
        Plan.restaurants[2] = 0x42033Ed8A06DF40Fd4933F5D03E2558aE1412f15;
        Plan.signature = new bool[](numOfParties);
        Plan.signature[0] = true;
        Plan.signature[1] = true;
        Plan.signature[2] = true;
        Plan.active = true;
        Plan.minSpentAmtList = new uint[](numOfParties);
        Plan.minSpentAmtList[0] = 100;
        Plan.minSpentAmtList[1] = 100;
        Plan.minSpentAmtList[2] = 100;
        Plan.discountAmtList = new uint[](numOfParties);
        Plan.discountAmtList[0] = 20;
        Plan.discountAmtList[1] = 20;
        Plan.discountAmtList[2] = 20;
        Plan.startDate = now;
        Plan.endDate = now.add(1 years);
        Plan.monthlyFee = 120;
        queryPlan[currentPlanNo] = Plan;
    }


}
