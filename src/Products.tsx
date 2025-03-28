function Products() {

    let Monproduit:Array<string | number> = ["Banane", 1000, "Fruits", 20];
    return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        
        <div style={{ border: '2px solid #E5E7EB', padding: '1rem', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s ease-in-out', cursor: 'pointer' }}>
            <span>En stock: {Monproduit[3]}</span>
            <img src="test.png" alt="Mon produit" style={{ width: '15rem', padding: '0.5rem' }} />

            <h3 style={{ fontSize: '1.875rem' }}>{Monproduit[0]}</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <p>{Monproduit[1]} FCFA</p>
                <p>{Monproduit[2]}</p>
            </div>
            {/* Removed Monproduit[4] as it does not exist */}
            
        </div>
    </div>
    )
}

export default Products;