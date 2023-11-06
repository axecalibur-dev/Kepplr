import Memcached from "memcached";
class MemcachedService {
  connect = async () => {
    const memcached_connect = new Memcached("memcached-container:11211", {
      options: {
        retries: 1, // Number of retry attempts for failed operations
        retry: 1000, // Delay between retry attempts (in milliseconds)
        remove: true, // Remove unavailable servers from the pool
        timeout: 5000, // Maximum time to wait for a Memcached operation (in milliseconds)
      },
    });

    return memcached_connect;
  };
}

export default MemcachedService;
