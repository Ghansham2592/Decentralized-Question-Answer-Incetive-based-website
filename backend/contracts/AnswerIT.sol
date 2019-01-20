pragma solidity ^0.4.17;

contract AnswerIT
{


    function AnswerIT() public
    {
            msgCount=0;

    }

    /*
    # ------------------------------------------------------------------------------
    # | Memeber Registration and Logging                                           |
    # ------------------------------------------------------------------------------
    */


    struct member
    {
        string  name;
        address  addr;

    }

    mapping (address => bool) public OldMember;
    mapping (address => bytes32) private _key_value;
    mapping (address => member) private _memberDetails;
    mapping (address => bool) private _logged;

    modifier notRegistered()
    {
        assert(!OldMember[msg.sender]);
        _;

    }


    function make_secure(string _pass) internal notRegistered
    {
        bytes memory _arg1 =  bytes(_pass);
        bytes memory _arg2 =  new bytes(20);
        address x=msg.sender;
        for (uint i = 0; i < 20; i++)
            _arg2[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
        string memory _temps = new string( _arg1.length + _arg2.length );
        bytes memory _target_s = bytes(_temps);
        uint k=0;
        for(i=0;i<_arg1.length;i++) _target_s[k++]=_arg1[i++];
        for(i=0;i<_arg2.length;i++) _target_s[k++]=_arg2[i++];
        bytes32 _sha256;
        _sha256=keccak256(_target_s);

        _key_value[msg.sender]=_sha256;
    }

    function register(string _name,string keyphrase) public notRegistered
    {
        _memberDetails[msg.sender] = member(_name,msg.sender);
        make_secure(keyphrase);
        OldMember[msg.sender]=true;
    }

    function login(string keyphrase) public
    {
        assert(msg.sender== _memberDetails[msg.sender].addr);

        bytes memory _arg1 =  bytes(keyphrase);
        bytes memory _arg2 =  new bytes(20);
        address x=msg.sender;
        for (uint i = 0; i < 20; i++)
            _arg2[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
        string memory _temps = new string( _arg1.length + _arg2.length );
        bytes memory _target_s = bytes(_temps);
        uint k=0;
        for(i=0;i<_arg1.length;i++) _target_s[k++]=_arg1[i++];
        for(i=0;i<_arg2.length;i++) _target_s[k++]=_arg2[i++];
        bytes32 _sha256;
        _sha256=keccak256(_target_s);

        assert(_key_value[msg.sender] == _sha256);

        _logged[msg.sender] = true;

    }



    /*
    # ------------------------------------------------------------------------------
    # | Posting Questions and Answers                                                                |
    # ------------------------------------------------------------------------------
    */



    //track of counter for Questions
    uint public msgCount;

    //Model of a question
    struct Question
    {
        address owner;   
        uint id; 
        string data; 
        string ans; 
        string username; 
        uint ansCount; 
        //Holds the ans as a map to the counter.
        bool selected_ans;
        uint total_incentives; 
        mapping (uint => Answer ) ansMap; 

    }


    //Model of a Answer
    struct Answer
    {
        address owner;
        uint id;
        string ans;
        string username;
        uint upvoteCount;
        uint answerValue;

    }

    //Holds the post as a map to the counter.
    mapping (uint => Question ) public Messages;


    
    event NewPost();

    modifier loggedMember()
    {
        assert(OldMember[msg.sender] && _logged[msg.sender]);
        _;
    }

    //Question creation
    function PostQuestion(string question) public
    {   
        Messages[msgCount] = Question(msg.sender,msgCount, question, "",_memberDetails[msg.sender].name,0, false, 0);
        //Increment the msg counter
        msgCount++;
        NewPost();
    }


    //Message creation
    function PostAnswer(uint Count, string ans) public
    {   
        Messages[Count].ans = ans;
       
        Messages[Count].ansMap[Messages[Count].ansCount] = Answer(msg.sender, Messages[Count].ansCount, ans,_memberDetails[msg.sender].name,0,10);
        Messages[Count].ansCount++;

        NewPost();
    }

    function GetOwnerAddress(uint Count, uint ans_id) public constant returns (address)
    {   
        return Messages[Count].ansMap[ans_id].owner;
    }

    function IterateAnswers(uint Count, uint ans_id) public constant returns (string)
    {   
        return Messages[Count].ansMap[ans_id].ans;
    }


    function GetUpvoteValue(uint Count, uint ans_id) public constant returns (uint)
    {   
        return Messages[Count].ansMap[ans_id].answerValue;
    }

    function GetUpvoteCount(uint Count, uint ans_id) public constant returns (uint)
    {   
        return Messages[Count].ansMap[ans_id].upvoteCount;
    }

    function UpvoteAnswer(uint Count, uint ans_id) public
    {
       Messages[Count].ansMap[ans_id].upvoteCount++;

        if (!Messages[Count].selected_ans){
            Messages[Count].total_incentives = Messages[Count].total_incentives + 2; 

            if (Messages[Count].ansMap[ans_id].upvoteCount == 10){
                Messages[Count].ansMap[ans_id].owner.transfer(Messages[Count].total_incentives);
                Messages[Count].total_incentives = 0;
                Messages[Count].selected_ans = true;
            }
        }
    }



    
    function logout() public
    {
        _logged[msg.sender] = false;

    }


}
