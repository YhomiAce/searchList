import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import filter from "lodash.filter";

export default function App() {
  const url = "https://randomuser.me/api/?results=30";
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [fullData, setFullData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (url) => {
    try {
      setIsLoading(true);
      const res = await fetch(url);
      const result = await res.json();
      console.log(result.results);
      setData(result.results);
      setFullData(result.results);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error);
    }
  };

  const handleSearch = (q) => {
    setQuery(q);
    const formattedQuery = q.toLowerCase();
    const filteredData = filter(fullData, (user) => {
      return contains(user, formattedQuery);
    });
    setData(filteredData);
  };

  const contains = ({ name, email }, q) => {
    const { first, last } = name;
    if (first.includes(q) || last.includes(q) || email.includes(q)) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    fetchData(url);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>An Error occured, Please check your internet</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Search..."
        clearButtonMode="always"
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        value={query}
        onChangeText={(text) => handleSearch(text)}
      />
      <FlatList
        data={data}
        keyExtractor={(item) => item.login.uuid}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image
              source={{ uri: item.picture?.thumbnail }}
              style={styles.image}
            />
            <View>
              <Text style={styles.textName}>
                {item.name?.first} {item.name?.last}
              </Text>
              <Text style={styles.textEmail}>{item.email}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 50,
  },
  input: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginTop: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textName: {
    fontSize: 17,
    marginLeft: 10,
    fontWeight: "600",
  },
  textEmail: {
    fontSize: 14,
    marginLeft: 10,
    color: "grey",
  },
});
