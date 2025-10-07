// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Polka32 {
    struct Device {
        string name;
        uint256 time;
    }
    
    mapping(address => Device[]) public devices;
    uint256 public total;
    
    event Reg(address indexed owner);
    
    function add(string calldata name) external {
        devices[msg.sender].push(Device(name, block.timestamp));
        total++;
        emit Reg(msg.sender);
    }
    
    function ping(uint256 i) external {
        devices[msg.sender][i].time = block.timestamp;
    }
    
    function get(address a) external view returns (Device[] memory) {
        return devices[a];
    }
}
