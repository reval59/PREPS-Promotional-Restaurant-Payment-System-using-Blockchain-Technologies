pragma solidity 0.4.24;
import "./MembershipRepository.sol";
import "./RestaurantRepository.sol";
import "./CommentRepository.sol";
contract Deployment {
    MembershipRepository private membershipRepository;
    CommentRepository private commentRepository;
    RestaurantRepository private restaurantRepository;
    constructor(){
        restaurantRepository = new RestaurantRepository();
        commentRepository = new CommentRepository();
        membershipRepository = new MembershipRepository();

        restaurantRepository.setMembershipRepository(address(membershipRepository));
        restaurantRepository.setCommentRepository(address(commentRepository));
        membershipRepository.setRestaurantRepository(address(restaurantRepository));
        commentRepository.setRestaurantRepository(address(restaurantRepository));

        // Sample Data
        string memory desc = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.";
        string memory contact = "abc@abc.com, XXXX-XXXX";
        restaurantRepository.registerRestaurantForTest(0xb2C6709463c084b00Db413488f5D6677C39d27BE, "Restaurant 1", desc, contact, "/img/sample/banner/a.jpg", 4);
        restaurantRepository.registerRestaurantForTest(0xB53A4E90b720c68d5BeB996739c2BAA4fcBD10B6, "Restaurant 2", desc, contact, "/img/sample/banner/b.jpg", 4);
        restaurantRepository.registerRestaurantForTest(0x42033Ed8A06DF40Fd4933F5D03E2558aE1412f15, "Restaurant 3", desc, contact, "/img/sample/banner/c.jpg", 4);

        string memory menuDesc = "Vivamus elementum semper nisi";
        for(uint i=0; i<restaurantRepository.getRestaurantAddressList().length; i++){
            Restaurant r = Restaurant(restaurantRepository.getRestaurantAddressList()[i]);
            r.addMenuItem("Chicken", menuDesc, "/img/sample/menu/chicken.jpg", 150);
            r.addMenuItem("Bibimbap", menuDesc, "/img/sample/menu/bibimbap.jpg", 60);
            r.addMenuItem("Dim Sum", menuDesc, "/img/sample/menu/dimsum.jpg", 70);
            r.addMenuItem("Dry Noodle", menuDesc, "/img/sample/menu/noodle.jpg", 50);
            r.addMenuItem("Tofu", menuDesc, "/img/sample/menu/tofu.jpg", 40);
            r.addMenuItem("Coffee", menuDesc, "/img/sample/menu/coffee.jpg", 30);
            r.addMenuItem("Milk Tea", menuDesc, "/img/sample/menu/milktea.jpg", 25);
            if (i==0){
                r.setLocation(114, 175100, 22, 336990);
            } else if(i==1){
                r.setLocation(114, 178200, 22, 338588);
            } else {
                r.setLocation(114, 181065, 22, 330613);
            }

        }

        membershipRepository.sampleMembership();
    }
    
    function getRestaurantRepository() public view returns(address){
        return address(restaurantRepository);
    }
    function getCommentRepository() public view returns(address){
        return address(commentRepository);
    }
    function getMembershipRepository() public view returns(address){
        return address(membershipRepository);
    }
}
