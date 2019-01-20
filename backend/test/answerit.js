var AnswerIT = artifacts.require("./AnswerIT.sol");

contract("AnswerIT", function(accounts)
{

    it("Initial Posts ", function()
    {
        return AnswerIT.deployed().then(function(inst)
        {
            return inst.msgCount();
        }).then(function(cnt)

        {
            assert.equal(cnt,0);
        });

    });

    var MemberInst;
    it("Create a Member ", function()
    {
        return AnswerIT.deployed().then(function(inst)
        {
            MemberInst=inst;
            MemberInst.register("User1","testval");
        }).then(function()
        {
             return MemberInst.OldMember.call(accounts[0],{from:accounts[0]});

        }).then(function(memb)
        {
            assert.equal(memb,true);
        });
    });

    it("Make a Post", function()
    {
        return AnswerIT.deployed().then(function(inst)
        {
            MemberInst=inst;
            MemberInst.login("testval",{from:accounts[0]});
        }).then(function()
        {
            MemberInst.PostMessage("hello",{from:accounts[0]});
        }).then(function()
        {
            return MemberInst.msgCount.call();
        }).then(function(cnt)
        {
            assert.equal(cnt,1);
        });
    });



});
