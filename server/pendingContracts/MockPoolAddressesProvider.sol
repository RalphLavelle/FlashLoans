// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import { IPoolAddressesProvider } from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";

contract MockPoolAddressesProvider is IPoolAddressesProvider {
	//event MarketIdSet(string indexed oldMarketId, string indexed newMarketId);
	//event PoolUpdated(address indexed oldAddress, address indexed newAddress);
	//event PoolConfiguratorUpdated(address indexed oldAddress, address indexed newAddress);
	//event PriceOracleUpdated(address indexed oldAddress, address indexed newAddress);
	//event ACLManagerUpdated(address indexed oldAddress, address indexed newAddress);
	// event ACLAdminUpdated(address indexed oldAddress, address indexed newAddress);

	function getACLAdmin() external view override returns (address) {
		return address(0);
	}

	function getACLManager() external view override returns (address) {
		return address(0);
	}

	function getMarketId() external view override returns (string memory) {
		return "aave";
	}

	function getPool() external view override returns (address) {
		return address(0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0);
	}

	function getPoolDataProvider() external view override returns (address) {
		return address(0);
	}

	function getPriceOracle() external view override returns (address) {
		return address(0);
	}

	function getPriceOracleSentinel() external view override returns (address) {
		return address(0);
	}

	function setACLAdmin(address newAclAdmin) external override {
		emit ACLAdminUpdated(address(0), newAclAdmin);
	}

	function setACLManager(address newAclManager) external override {
		emit ACLManagerUpdated(address(0), newAclManager);
	}

	function setAddress(bytes32 id, address newAddress) external override {

	}

	function setAddressAsProxy(bytes32 id, address newImplementationAddress) external override {

	}

	function setMarketId(string calldata newMarketId) external override {
		emit MarketIdSet("aave", newMarketId);
	}

	function setPoolConfiguratorImpl(address newPoolConfiguratorImpl) external override {

	}

	function setPoolDataProvider(address newDataProvider) external override {

	}

	function setPoolImpl(address newPoolImpl) external override {

	}

	function setPriceOracleSentinel(address newPriceOracleSentinel) external override {

	}

	function getPoolConfigurator() external view override returns (address) {
		return address(0);
	}

	function getAddress(bytes32 id) external view override returns (address) {
		return address(0);
	}

	function setPriceOracle(address newPriceOracle) external override {

	}
}