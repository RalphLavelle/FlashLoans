// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import { IPoolAddressesProvider } from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";

contract MockPoolAddressesProvider is IPoolAddressesProvider {
	//event MarketIdSet(string indexed oldMarketId, string indexed newMarketId);
	//event PoolUpdated(address indexed oldAddress, address indexed newAddress);
	//event PoolConfiguratorUpdated(address indexed oldAddress, address indexed newAddress);
	//event PriceOracleUpdated(address indexed oldAddress, address indexed newAddress);
	//event ACLManagerUpdated(address indexed oldAddress, address indexed newAddress);
	// event ACLAdminUpdated(address indexed oldAddress, address indexed newAddress);

	function getACLAdmin() external view returns (address) {
		return address(0);
	}

	function getACLManager() external view returns (address) {
		return address(0);
	}

	function getMarketId() external view returns (string memory) {
		return "aave";
	}

	function getPool() external view returns (address) {
		return address(0);
	}

	function getPoolDataProvider() external view returns (address) {
		return address(0);
	}

	function getPriceOracle() external view returns (address) {
		return address(0);
	}

	function getPriceOracleSentinel() external view returns (address) {
		return address(0);
	}

	function setACLAdmin(address newAclAdmin) external {
		emit ACLAdminUpdated(address(0), newAclAdmin);
	}

	function setACLManager(address newAclManager) external {
		emit ACLManagerUpdated(address(0), newAclManager);
	}

	function setAddress(bytes32 id, address newAddress) external {

	}

	function setAddressAsProxy(bytes32 id, address newImplementationAddress) external {

	}

	function setMarketId(string calldata newMarketId) external {
		emit MarketIdSet("aave", newMarketId);
	}

	function setPoolConfiguratorImpl(address newPoolConfiguratorImpl) external {

	}

	function setPoolDataProvider(address newDataProvider) external {

	}

	function setPoolImpl(address newPoolImpl) external {

	}

	function setPriceOracleSentinel(address newPriceOracleSentinel) external {

	}

	function getPoolConfigurator() external view returns (address) {
		return address(0);
	}

	function getAddress(bytes32 id) external view returns (address) {
		return address(0);
	}

	function setPriceOracle(address newPriceOracle) external {

	}
}