import { useEffect, useState } from 'react';
import "../css/Menu.css";
import { Buffer } from 'buffer';

function MenuEdit() {
    const [menuData, setMenuData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState({}); // To track which row is being edited

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                const response = await fetch('/owner/menu');
                if (!response.ok) {
                    throw new Error('Failed to fetch menu data');
                }
                const data = await response.json();
                setMenuData(data.menus); // Adjusted to access 'menus' array
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuData();
    }, []);

    // Handle loading state
    if (loading) {
        return <p>Loading menu data...</p>;
    }

    // Handle error state
    if (error) {
        return <p>Error: {error}</p>;
    }

    const handleInputChange = (e, menuItemId) => {
        const { name, value } = e.target;
        setMenuData(prevData =>
            prevData.map(menuItem =>
                menuItem._id === menuItemId ? { ...menuItem, [name]: value } : menuItem
            )
        );
    };

    const handleEditClick = (menuItemId) => {
        setEditing((prevEditing) => ({
            ...prevEditing,
            [menuItemId]: !prevEditing[menuItemId] // Toggle edit mode
        }));
    };

    const handleSaveClick = async (menuItemId) => {
        try {
            const menuItemToSave = menuData.find(menuItem => menuItem._id === menuItemId);

            const response = await fetch(`/owner/menu/${menuItemId}/edit`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(menuItemToSave), // Send updated menu item data
            });
            const handleSaveClick = async (menuItemId) => {
                try {
                    const menuItemToSave = menuData.find(
                        (menuItem) => menuItem._id === menuItemId
                    );
            
                    const formData = new FormData();
                    formData.append('name', menuItemToSave.name);
                    formData.append('sku', menuItemToSave.sku);
                    formData.append('description', menuItemToSave.description);
                    formData.append('price', menuItemToSave.price);
                    formData.append('inStock', menuItemToSave.inStock);
                    if (menuItemToSave.newImage) {
                        formData.append('menuImage', menuItemToSave.newImage);
                    }
            
                    const response = await fetch(`/owner/menu/${menuItemId}/edit`, {
                        method: 'PATCH',
                        body: formData,
                        // Note: When using FormData, the 'Content-Type' header is set automatically
                    });
            
                    if (!response.ok) {
                        throw new Error('Failed to update menu item');
                    }
            
                    setEditing((prevEditing) => ({
                        ...prevEditing,
                        [menuItemId]: false, // Exit edit mode after saving
                    }));
                } catch (err) {
                    setError(err.message);
                }
            };
            
            if (!response.ok) {
                throw new Error('Failed to update menu item');
            }

            setEditing((prevEditing) => ({
                ...prevEditing,
                [menuItemId]: false // Exit edit mode after saving
            }));

        } catch (err) {
            setError(err.message);
        }
    };

    const handleImageClick = (menuItemId) => {
        setEditing((prevEditing) => ({
            ...prevEditing,
            [menuItemId]: !prevEditing[menuItemId], // Toggle edit mode
        }));
    };
    const handleImageChange = (e, menuItemId) => {
        const file = e.target.files[0];
        if (file) {
            // Optionally, add validation for file type and size here
            const reader = new FileReader();
            reader.onload = () => {
                setMenuData((prevData) =>
                    prevData.map((menuItem) =>
                        menuItem._id === menuItemId
                            ? { ...menuItem, newImage: reader.result }
                            : menuItem
                    )
                );
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div id="container-menu">
            <h1>Restaurant Menu</h1>
            <table className="menu-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>In Stock</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {menuData.map((menuItem) => (
                        <tr key={menuItem._id}>
                            {/* Name Field */}
                            <td>
                                {editing[menuItem._id] ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={menuItem.name}
                                        onChange={(e) => handleInputChange(e, menuItem._id)}
                                    />
                                ) : (
                                    menuItem.name
                                )}
                            </td>

                            {/* SKU Field */}
                            <td>
                                {editing[menuItem._id] ? (
                                    <input
                                        type="text"
                                        name="sku"
                                        value={menuItem.sku}
                                        onChange={(e) => handleInputChange(e, menuItem._id)}
                                    />
                                ) : (
                                    menuItem.sku
                                )}
                            </td>

                            {/* Description Field */}
                            <td>
                                {editing[menuItem._id] ? (
                                    <textarea
                                        name="description"
                                        value={menuItem.description}
                                        onChange={(e) => handleInputChange(e, menuItem._id)}
                                    />
                                ) : (
                                    menuItem.description
                                )}
                            </td>

                            {/* Price Field */}
                            <td>
                                {editing[menuItem._id] ? (
                                    <input
                                        type="number"
                                        name="price"
                                        value={menuItem.price}
                                        onChange={(e) => handleInputChange(e, menuItem._id)}
                                    />
                                ) : (
                                    `$${Number(menuItem.price).toFixed(2)}`
                                )}
                            </td>

                            {/* In Stock Field */}
                            <td>
                                {editing[menuItem._id] ? (
                                    <select
                                        name="inStock"
                                        value={menuItem.inStock}
                                        onChange={(e) => handleInputChange(e, menuItem._id)}
                                    >
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                ) : (
                                    menuItem.inStock ? 'Yes' : 'No'
                                )}
                            </td>

                            {/* Image Field */}
                            <td>
                                {menuItem.menu_images_url && menuItem.menu_images_url.img && menuItem.menu_images_url.img.data && menuItem.menu_images_url.img.contentType ? (
                                    <img
                                        src={`data:${menuItem.menu_images_url.img.contentType};base64,${Buffer.from(menuItem.menu_images_url.img.data).toString('base64')}`} // Convert the buffer to base64 in React
                                        alt={menuItem.name || 'Menu Item Image'}
                                        style={{ width: '200px', height: 'auto' }}
                                        onClick={() => handleImageClick(menuItem._id)}
                                    />
                                ) : (
                                    <p>No image available</p> // Fallback text if image data is missing
                                )}
                            </td>

                            {/* Actions */}
                            <td>
                                {editing[menuItem._id] ? (
                                    <button onClick={() => handleSaveClick(menuItem._id)}>Save</button>
                                ) : (
                                    <button onClick={() => handleEditClick(menuItem._id)}>Edit</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MenuEdit;
