import Deployment from '../core/build/contracts/Deployment.json'
import RestaurantRepository from '../core/build/contracts/RestaurantRepository.json'
import Restaurant from '../core/build/contracts/Restaurant.json'
import MembershipRepository from '../core/build/contracts/MembershipRepository.json'
import CommentRepository from '../core/build/contracts/CommentRepository.json'


export default {
    getJSON:function(contractName){
        if(contractName=="Deployment") return Deployment
        else if(contractName=="RestaurantRepository")return RestaurantRepository
        else if(contractName=="Restaurant")return Restaurant
        else if(contractName=="MembershipRepository")return MembershipRepository
        else if(contractName=="CommentRepository")return CommentRepository
        else return null
    }
}