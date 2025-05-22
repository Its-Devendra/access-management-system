import React, { useState, useEffect } from "react";
import {
  FiPackage,
  FiLoader,
  FiX,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiTag,
  FiShield,
  FiInfo,
  FiGrid,
  FiList,
  FiStar,
  FiUsers,
} from "react-icons/fi";
import softwareService from "../../services/softwareService";
import "./SoftwareList.scss";

const SoftwareList = () => {
  const [software, setSoftware] = useState([]);
  const [filteredSoftware, setFilteredSoftware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [accessLevelFilter, setAccessLevelFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSoftware();
  }, []);

  useEffect(() => {
    filterSoftware();
  }, [software, searchTerm, accessLevelFilter]);

  const fetchSoftware = async () => {
    try {
      const data = await softwareService.getAllSoftware();
      setSoftware(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to load software list");
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await softwareService.getAllSoftware();
      setSoftware(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to refresh software list");
    }
    setRefreshing(false);
  };

  const filterSoftware = () => {
    let filtered = software;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by access level
    if (accessLevelFilter !== "all") {
      filtered = filtered.filter((item) =>
        item.accessLevels.some((level) =>
          level.toLowerCase().includes(accessLevelFilter.toLowerCase())
        )
      );
    }

    setFilteredSoftware(filtered);
  };

  // Get all unique access levels for filter
  const getAllAccessLevels = () => {
    const allLevels = software.flatMap((item) => item.accessLevels);
    return [...new Set(allLevels)];
  };

  const getAccessLevelColor = (level) => {
    const colors = {
      full: "level-full",
      read: "level-read",
      write: "level-write",
      admin: "level-admin",
      viewer: "level-viewer",
      editor: "level-editor",
      basic: "level-basic",
      premium: "level-premium",
    };

    const lowerLevel = level.toLowerCase();
    for (const [key, className] of Object.entries(colors)) {
      if (lowerLevel.includes(key)) {
        return className;
      }
    }
    return "level-default";
  };

  const getSoftwareIcon = (name) => {
    // You can customize this based on software names
    const icons = {
      adobe: "🎨",
      microsoft: "💼",
      google: "🔍",
      slack: "💬",
      zoom: "📹",
      salesforce: "☁️",
      github: "🐙",
      jira: "📋",
    };

    const lowerName = name.toLowerCase();
    for (const [key, icon] of Object.entries(icons)) {
      if (lowerName.includes(key)) {
        return icon;
      }
    }
    return "📦";
  };

  if (loading) {
    return (
      <div className="software-list">
        <div className="loading-container">
          <FiLoader className="loading-spinner" />
          <p>Loading software catalog...</p>
        </div>
      </div>
    );
  }

  if (error && software.length === 0) {
    return (
      <div className="software-list">
        <div className="error-container">
          <FiX className="error-icon" />
          <h3>Error Loading Software</h3>
          <p>{error}</p>
          <button className="retry-button" onClick={fetchSoftware}>
            <FiRefreshCw />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="software-list">
      <div className="software-list__header">
        <div className="header-content">
          <h1 className="page-title">
            <FiPackage className="title-icon" />
            Software Catalog
          </h1>
          <p className="page-subtitle">
            Browse available software and their access levels
          </p>
        </div>
      </div>

      {software.length === 0 ? (
        <div className="empty-state">
          <FiPackage className="empty-icon" />
          <h3>No Software Available</h3>
          <p>There are no software applications available at the moment.</p>
        </div>
      ) : (
        <>
          <div className="filters-section">
            <div className="filter-container">
              <FiFilter className="filter-icon" />
              <select
                value={accessLevelFilter}
                onChange={(e) => setAccessLevelFilter(e.target.value)}
                className="access-filter"
              >
                <option value="all">All Access Levels</option>
                {getAllAccessLevels().map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="software-stats">
            <div className="stat-item">
              <span className="stat-number">{software.length}</span>
              <span className="stat-label">Total Software</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{getAllAccessLevels().length}</span>
              <span className="stat-label">Access Types</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{filteredSoftware.length}</span>
              <span className="stat-label">Available</span>
            </div>
          </div>

          <div
            className={`software-grid ${
              viewMode === "list" ? "list-view" : ""
            }`}
          >
            {filteredSoftware.map((item) => (
              <div key={item.id} className="software-card">
                <div className="card-header">
                  <div className="software-info">
                    <div className="software-icon">
                      {getSoftwareIcon(item.name)}
                    </div>
                    <div className="software-details">
                      <h3 className="software-name">{item.name}</h3>
                      <div className="software-meta">
                        <span className="meta-item">
                          <FiUsers className="meta-icon" />
                          Multi-user
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button className="info-button" title="More Info">
                      <FiInfo />
                    </button>
                    <button
                      className="favorite-button"
                      title="Add to Favorites"
                    >
                      <FiStar />
                    </button>
                  </div>
                </div>

                <div className="card-body">
                  <div className="software-description">
                    <p>{item.description}</p>
                  </div>

                  <div className="access-levels-section">
                    <div className="section-header">
                      <FiShield className="section-icon" />
                      <span className="section-title">
                        Available Access Levels
                      </span>
                    </div>

                    <div className="access-levels">
                      {item.accessLevels.map((level, index) => (
                        <div
                          key={index}
                          className={`access-level-badge ${getAccessLevelColor(
                            level
                          )}`}
                        >
                          <FiTag className="level-icon" />
                          <span>{level}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <div className="footer-info">
                    <span className="access-count">
                      {item.accessLevels.length} access level
                      {item.accessLevels.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <button className="request-access-button">
                    Request Access
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredSoftware.length === 0 && software.length > 0 && (
            <div className="no-results">
              <FiSearch className="no-results-icon" />
              <h3>No matching software</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SoftwareList;
