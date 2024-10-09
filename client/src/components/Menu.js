import { useEffect, useState } from 'react';
import "../css/Menu.css";
import { Buffer } from 'buffer';


function Menu() {
    const [menuData, setMenuData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                const response = await fetch('/owner/menu');
                if (!response.ok) {
                    throw new Error('Failed to fetch menu data');
                }
                const data = await response.json();
                //console.log('Fetched menu data:', data);
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
                    </tr>
                </thead>
                <tbody>
                    {menuData.map((menuItem) => (
                        <tr key={menuItem._id}>
                            <td>{menuItem.name}</td>
                            <td>{menuItem.sku}</td>
                            <td>{menuItem.description}</td>
                            <td>${menuItem.price.toFixed(2)}</td>
                            <td>{menuItem.inStock ? 'Yes' : 'No'}</td>
                            <td>
                                {menuItem.menu_images_url && menuItem.menu_images_url.img && menuItem.menu_images_url.img.data && menuItem.menu_images_url.img.contentType ? (
                                    <img
                                        src={`data:${menuItem.menu_images_url.img.contentType};base64,${Buffer.from(menuItem.menu_images_url.img.data).toString('base64')}`} // Convert the buffer to base64 in React
                                        alt={menuItem.name || 'Menu Item Image'}
                                        style={{ width: '200px', height: 'auto' }}
                                    />

                                ) : (
                                    <p>No image available</p> // Fallback text if image data is missing
                                )}
                            </td>



                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Menu;

