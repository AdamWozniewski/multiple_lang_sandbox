db.getSiblingDB("admin").createUser({
    user: "admin",
    pwd: "example",
    roles: [
        { role: "root", db: "admin" },
        { role: "readWrite", db: "nodejs" }
    ]
});